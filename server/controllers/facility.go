package controllers

import (
	"encoding/json"
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

func GetAllFacility(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	facilities := []models.Facility{}

	db.Find(&facilities)
	var responses []models.FacilityResponse
	for _, facility := range facilities {
		responses = append(responses, *facility.ToResponse())
	}
	respondJSON(w, http.StatusOK, utils.ToResponse(r, responses, "Berhasil ambil fasilitas"))
}

func CreateFacility(db *gorm.DB, w http.ResponseWriter, r *http.Request) {

	facility := models.Facility{
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
	filename := fmt.Sprintf("IMG_facility_%s_%s%s", date, randStr, filepath.Ext(handler.Filename))

	dirPath := filepath.Join(dir, "public", "facility")
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

	facility.Image = filename

	if err := db.Create(&facility).Error; err != nil {
		respondError(w, http.StatusInternalServerError, "Failed to create facility: "+err.Error())
		return
	}

	response := facility.ToResponse()
	respondJSON(w, http.StatusCreated, utils.Response{
		Items:   response,
		Message: "Berhasil menambahkan fasilitas gym",
	})
}

func DetailFacility(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	user := models.User{}
	result := db.Find(&user)
	respondJSON(w, http.StatusOK, result)
	defer r.Body.Close()
}

func UpdateFacility(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	facility := models.Facility{}
	newFacility := models.Facility{
		Name: r.FormValue("name"),
	}
	c := r.FormValue("facility_id")
	if c == "" {
		respondError(w, http.StatusBadRequest, "Facility harus diisi")
		return
	}

	db.Model(&facility).Where("id = ?", c).First(&facility)
	uploadedFile, handler, err := r.FormFile("image")
	if err == nil {
		if err != http.ErrMissingFile {
			if err := r.ParseMultipartForm(2 << 20); err != nil {
				respondError(w, http.StatusBadRequest, "file melebihi 2mb")
				return
			}
			dir, err := os.Getwd()
			oldFacility := facility.Image
			if oldFacility != "" {
				oldFacilityPath := filepath.Join(dir, "public/facility", oldFacility)
				if _, err := os.Stat(oldFacilityPath); err == nil {
					os.Remove(oldFacilityPath)
				}
			}
			defer uploadedFile.Close()

			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			dateStr := time.Now().Format("20060102")
			uniqueUUID := uuid.New().String()
			filename := fmt.Sprintf("IMG_facility_%s_%s%s", dateStr, uniqueUUID, filepath.Ext(handler.Filename))
			fileLocation := filepath.Join(dir, "public/facility", filename)
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
			newFacility.Image = filename
		} else {
			respondError(w, http.StatusBadRequest, "gambar facility harus ada")
			return
		}
	}

	db.Model(&facility).Updates(&newFacility)
	respondJSON(w, http.StatusCreated, utils.Response{
		Items:   facility.ToResponse(),
		Message: "Berhasil mengubah fasilitas gym",
	})
}

func DeleteFacility(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	gym := models.Gym{}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&gym); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}
	defer r.Body.Close()
}
