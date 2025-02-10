package controllers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"server/pkg/models"
	"server/utils"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func GetAllMethod(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	methods := []models.Method{}

	db.Find(&methods)
	var responses []models.MethodResponse
	for _, method := range methods {
		responses = append(responses, *method.ToResponse())
	}
	respondJSON(w, http.StatusOK, utils.ToResponse(r, responses, "Berhasil ambil metode pembayaran"))
}

func CreateMethod(db *gorm.DB, w http.ResponseWriter, r *http.Request) {

	method := models.Method{
		Name: r.FormValue("name"),
	}

	uploadedFile, handler, err := r.FormFile("image")
	if err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}
	defer uploadedFile.Close()

	dir, _ := os.Getwd()
	date := time.Now().Format("20060102")
	randStr := uuid.New().String()
	filename := fmt.Sprintf("IMG_method_%s_%s%s", date, randStr, filepath.Ext(handler.Filename))

	dirPath := filepath.Join(dir, "public", "method")
	if err := os.MkdirAll(dirPath, 0666); err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to create directory: "+err.Error())
		return
	}

	location := filepath.Join(dirPath, filename)
	targetFile, err := os.OpenFile(location, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0666)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to save file: "+err.Error())
		return
	}
	defer targetFile.Close()

	if _, err := io.Copy(targetFile, uploadedFile); err != nil {
		respondError(w, http.StatusBadRequest, "Failed to copy file content: "+err.Error())
		return
	}

	method.Image = filename

	if err := db.Create(&method).Error; err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to create method: "+err.Error())
		return
	}

	response := method.ToResponse()
	respondJSON(w, http.StatusCreated, response)
}

func UpdateMethod(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	method := models.Method{}
	newM := models.Method{
		Name: r.FormValue("name"),
	}
	c := r.FormValue("method_id")
	if c == "" {
		respondError(w, http.StatusBadRequest, "Method harus diisi")
		return
	}

	db.Model(&method).Where("id = ?", c).First(&method)
	uploadedFile, handler, err := r.FormFile("image")
	if err == nil {
		if err != http.ErrMissingFile {
			if err := r.ParseMultipartForm(2 << 20); err != nil {
				respondError(w, http.StatusBadRequest, "file melebihi 2mb")
				return
			}
			dir, err := os.Getwd()
			oldmethod := method.Image
			fmt.Println(oldmethod)
			if oldmethod != "" {
				oldmethodPath := filepath.Join(dir, "public/method", oldmethod)
				if _, err := os.Stat(oldmethodPath); err == nil {
					os.Remove(oldmethodPath)
				}
			}
			defer uploadedFile.Close()

			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			dateStr := time.Now().Format("20060102")
			uniqueUUID := uuid.New().String()
			filename := fmt.Sprintf("IMG_method_%s_%s%s", dateStr, uniqueUUID, filepath.Ext(handler.Filename))
			fileLocation := filepath.Join(dir, "public/method", filename)
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
			newM.Image = filename
		} else {
			respondError(w, http.StatusBadRequest, "gambar method harus ada")
			return
		}
	}

	db.Model(&method).Updates(&newM)
	respondJSON(w, http.StatusCreated, method.ToResponse())
}
