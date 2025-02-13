package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"server/middleware"
	"server/pkg/models"
	"server/utils"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

func GetAllGym(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	var gyms []models.Gym
	result := db.Scopes(utils.Paginate(r)).Model(&models.Gym{}).Preload("Facilities").Preload("MembershipOptions").Find(&gyms)
	if result.Error != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	var responses []models.GymResponse
	for _, gym := range gyms {
		responses = append(responses, *gym.ToResponse())
	}
	respondJSON(w, http.StatusOK, utils.ToResponse(r, responses, "Success"))
}

func CreateGym(db *gorm.DB, w http.ResponseWriter, r *http.Request) {

	user := &models.User{}
	email, ok := r.Context().Value(middleware.EmailKey).(string)
	if email == "" || !ok {
		respondError(w, http.StatusBadRequest, "Akun tidak ditemukan")
		return
	}
	db.Where("email = ?", email).First(&user)
	ProvinceID, err := utils.ConvertStringToNumber(r.FormValue("province_id"))
	if err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}
	CityID, err := utils.ConvertStringToNumber(r.FormValue("city_id"))
	if err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		respondError(w, http.StatusBadRequest, "Gagal memproses form")
		return
	}

	gym := models.Gym{
		Name:        r.FormValue("name"),
		Description: r.FormValue("description"),
		StartTime:   r.FormValue("start_time"),
		EndTime:     r.FormValue("end_time"),
		Address:     r.FormValue("address"),
		CityID:      CityID,
		ProvinceID:  ProvinceID,
		UserID:      user.ID,
	}

	check, err := checkValidation(&gym)
	if err != nil {
		respondError(w, http.StatusBadRequest, check)
		return
	}

	imageCount := 0
	for {
		keyImage := fmt.Sprintf("images[%d]", imageCount)
		if _, _, err := r.FormFile(keyImage); err == http.ErrMissingFile || err != nil {
			break
		}
		imageCount++
	}

	var imageCollect []string
	for i := 0; i < imageCount; i++ {
		imageKey := fmt.Sprintf("images[%d]", i)
		uploadedFile, handler, err := r.FormFile(imageKey)
		if err == nil {
			if err != http.ErrMissingFile {
				if err := r.ParseMultipartForm(2 << 20); err != nil {
					respondError(w, http.StatusBadRequest, "file melebihi 2mb")
					return
				}
				dir, err := os.Getwd()
				defer uploadedFile.Close()

				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}

				dateStr := time.Now().Format("20060102")
				uniqueUUID := uuid.New().String()
				filename := fmt.Sprintf("IMG_banner_%s_%s%s", dateStr, uniqueUUID, filepath.Ext(handler.Filename))
				fileLocation := filepath.Join(dir, "public/image_banner", filename)
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
				imageCollect = append(imageCollect, filename)
			} else {
				respondError(w, http.StatusBadRequest, "gambar gym harus ada")
				return
			}

		}

	}

	imageJSON, _ := json.Marshal(imageCollect)
	gym.Images = string(imageJSON)

	if result := db.Create(&gym); result.Error != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	membershipOptions := []models.MembershipOption{}
	membershipCount := 0
	for {
		name := r.FormValue(fmt.Sprintf("membership_options[%d].name", membershipCount))
		price := r.FormValue(fmt.Sprintf("membership_options[%d].price", membershipCount))
		if name == "" && price == "" {
			break
		}
		membershipCount++
	}
	if len(membershipOptions) > 0 {
		db.Create(&membershipOptions)
	}

	respondJSON(w, http.StatusOK, gym.ToResponse())
	defer r.Body.Close()

}

func DetailGym(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	str, ok := vars["gymID"]
	if !ok {
		respondError(w, http.StatusBadRequest, "Missing gym id")
		return
	}

	gymID, err := strconv.Atoi(str)
	if err != nil {
		respondError(w, http.StatusBadRequest, "Invalid gym id")
		return
	}
	gym := &models.Gym{}
	result := db.Preload("Facilities").Preload("MembershipOptions").First(&gym, gymID)
	if result.Error != nil {
		respondError(w, http.StatusBadRequest, result.Error.Error())
		return
	}
	respondJSON(w, http.StatusOK, utils.Response{Items: gym.ToResponse()})
}

func UpdateGym(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	gym := models.Gym{}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&gym); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}
	defer r.Body.Close()
}

func DeleteGym(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	gym := models.Gym{}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&gym); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}
	defer r.Body.Close()
}

func GetCheckInGym(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	g := models.Gym{}
	m := []models.CheckIn{}
	vars := mux.Vars(r)
	gID, err := strconv.Atoi(vars["gymID"])
	if err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}
	db.First(&g, gID)
	res := db.Preload("Membership.User").Preload("Membership.MembershipOption").Find(&m).Error
	if res != nil {
		respondError(w, http.StatusBadRequest, "Membership tidak ada")
		return
	}

	respondJSON(w, http.StatusOK, utils.Response{
		Items: m,
	})
}

func CreateCheckInGym(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	code := r.FormValue("card_number")
	gID, err := strconv.Atoi(vars["gymID"])
	if err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
	}
	g := &models.Gym{}
	m := models.Membership{}
	res := db.Preload("User").Model(&m).Where("gym_id = ?", gID).Where("card_number = ?", code).First(&m)
	if res.Error != nil {
		respondError(w, http.StatusBadRequest, "Membership tidak ada dalam data  gym")
		return
	}
	now := time.Now()
	mDate := m.EndDate
	if now.After(mDate) {
		respondError(w, http.StatusBadRequest, "Membership sudah expired")
		return
	}
	db.First(&g, gID)
	c := &models.CheckIn{
		Name:         m.User.Name,
		MembershipID: m.ID,
		GymID:        g.ID,
	}
	db.Create(&c)
	respondJSON(w, http.StatusOK, m.MembershipResponse())
}
