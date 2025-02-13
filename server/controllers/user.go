package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"server/middleware"
	"server/pkg/models"
	"server/utils"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func GetAllUser(db *gorm.DB, w http.ResponseWriter, r *http.Request) {

}

func CreateUser(db *gorm.DB, w http.ResponseWriter, r *http.Request) {

	hashPassword, _ := utils.HashPassword(r.FormValue("password"))

	fmt.Println(hashPassword)
	user := models.User{
		Name:        r.FormValue("name"),
		Email:       r.FormValue("email"),
		PhoneNumber: r.FormValue("phone_number"),
		Password:    hashPassword,
		Role:        "admin",
	}

	db.Create(&user)

	response := user.ToResponse()
	respondJSON(w, http.StatusCreated, response)
	defer r.Body.Close()
}

func DetailUser(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	user := &models.User{}
	email, ok := r.Context().Value(middleware.EmailKey).(string)
	if email == "" || !ok {
		respondError(w, http.StatusBadRequest, "Akun tidak ditemukan")
		return
	}
	db.Where("email = ?", email).Preload("MethodPayments").First(&user)
	respondJSON(w, http.StatusOK, utils.ToResponse(r, user.ToResponse(), "Success"))
}

func UpdateUser(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	user := models.User{
		Name:        r.FormValue("name"),
		PhoneNumber: r.FormValue("phone_number"),
		Gender:      models.Gender(r.FormValue("gender")),
	}
	email, ok := r.Context().Value(middleware.EmailKey).(string)
	if email == "" || !ok {
		respondError(w, http.StatusBadRequest, "Akun tidak ditemukan")
		return
	}
	db.Model(&user).Where("email = ?", email).Updates(&user)
	uploadedFile, handler, err := r.FormFile("avatar")
	if err == nil {
		if err != http.ErrMissingFile {
			if err := r.ParseMultipartForm(2 << 20); err != nil {
				respondError(w, http.StatusBadRequest, "file melebihi 2mb")
				return
			}
			db.Where("email = ?", email).First(&user)
			dir, err := os.Getwd()
			oldAvatar := user.Avatar
			fmt.Println(oldAvatar)
			if oldAvatar != "" {
				oldAvatarPath := filepath.Join(dir, "public/avatar", oldAvatar)
				if _, err := os.Stat(oldAvatarPath); err == nil {
					os.Remove(oldAvatarPath)
				}
			}
			defer uploadedFile.Close()

			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			dateStr := time.Now().Format("20060102")
			uniqueUUID := uuid.New().String()
			filename := fmt.Sprintf("IMG_avatar_%s_%s%s", dateStr, uniqueUUID, filepath.Ext(handler.Filename))
			fileLocation := filepath.Join(dir, "public/avatar", filename)
			targetFile, err := os.OpenFile(fileLocation, os.O_WRONLY|os.O_CREATE, 0666)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			defer targetFile.Close()
			if _, err := io.Copy(targetFile, uploadedFile); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			user.Avatar = filename
		} else {
			respondError(w, http.StatusBadRequest, "gambar avatar harus ada")
			return
		}
	}

	respondJSON(w, http.StatusCreated, user.ToResponse())

}

func DeleteUser(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	gym := models.Gym{}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&gym); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}
	defer r.Body.Close()
}

func LoginUser(db *gorm.DB, w http.ResponseWriter, r *http.Request) {

	type UserToken struct {
		User  models.User `json:"user"`
		Token string      `json:"token"`
	}

	user := &models.User{
		Email:    r.FormValue("email"),
		Password: r.FormValue("password"),
	}
	if user.Email == "" {
		respondError(w, http.StatusBadRequest, "email harap diisi")
		return
	}
	userPassword := user.Password

	result := db.Where("email = ?", user.Email).First(&user)
	switch {
	case result.Error != nil:
		respondError(w, http.StatusNotFound, result.Error.Error())
		return
	case result.Error != nil:
		log.Fatalf("query error: %v\n", result.Error.Error())
	default:
		match := utils.CheckPasswordHash(userPassword, user.Password)

		if !match {
			respondError(w, http.StatusBadRequest, "Password salah!")
			return
		}

		userToken := &UserToken{}
		token := utils.MakeTokenFromEmail(db, user.Email)
		userToken.Token = token
		userToken.User = *user
		respondJSON(w, http.StatusOK, utils.ToResponse(r, userToken, "success"))
	}

}

func RegisterUser(db *gorm.DB, w http.ResponseWriter, r *http.Request) {

	hashPassword, _ := utils.HashPassword(r.FormValue("password"))
	user := models.User{
		Name:           r.FormValue("name"),
		Email:          r.FormValue("email"),
		PhoneNumber:    r.FormValue("phone_number"),
		Password:       hashPassword,
		Role:           r.FormValue("role"),
		IdentifyStatus: nil,
		Status:         models.False,
	}

	if err := db.Where("email = ?", user.Email).First(&user).Error; err == nil {
		respondError(w, http.StatusBadRequest, "Email sudah ada")
		return
	}

	result := db.Create(&user)

	response := user.ToResponse()
	if result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}
	respondJSON(w, http.StatusCreated, response)
	defer r.Body.Close()

}

func UploadKTP(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	user := models.User{}
	email, ok := r.Context().Value(middleware.EmailKey).(string)
	if email == "" || !ok {
		respondError(w, http.StatusBadRequest, "Akun tidak ditemukan")
		return
	}
	uploadedFile, handler, err := r.FormFile("identify")
	if err == nil {
		if err != http.ErrMissingFile {
			if err := r.ParseMultipartForm(2 << 20); err != nil {
				respondError(w, http.StatusBadRequest, "file melebihi 2mb")
				return
			}
			db.Where("email = ?", email).First(&user)
			dir, err := os.Getwd()
			oldKtp := user.Identify
			if oldKtp != "" {
				oldKtpPath := filepath.Join(dir, "public/ktp", oldKtp)
				if _, err := os.Stat(oldKtpPath); err == nil {
					os.Remove(oldKtpPath)
				}
			}
			defer uploadedFile.Close()

			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			dateStr := time.Now().Format("20060102")
			uniqueUUID := uuid.New().String()
			filename := fmt.Sprintf("IMG_KTP_%s_%s%s", dateStr, uniqueUUID, filepath.Ext(handler.Filename))
			fileLocation := filepath.Join(dir, "public/ktp", filename)
			targetFile, err := os.OpenFile(fileLocation, os.O_WRONLY|os.O_CREATE, 0666)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			defer targetFile.Close()
			if _, err := io.Copy(targetFile, uploadedFile); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			user.Identify = filename
			s := "pending"
			user.IdentifyStatus = &s
			db.Model(&user).Where("email = ?", email).Updates(&user)
		} else {
			respondError(w, http.StatusBadRequest, "gambar KTP harus ada")
			return
		}

		respondJSON(w, http.StatusCreated, map[string]interface{}{"items": user.ToResponse()})
	}
}
