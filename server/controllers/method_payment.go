package controllers

import (
	"encoding/json"
	"errors"
	"net/http"
	"server/middleware"
	"server/pkg/models"
	"server/utils"

	"gorm.io/gorm"
)

func GetMethodPayment(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	facilities := []models.Facility{}

	db.Find(&facilities)
	var responses []models.FacilityResponse
	for _, facility := range facilities {
		responses = append(responses, *facility.ToResponse())
	}
	respondJSON(w, http.StatusOK, utils.ToResponse(r, responses, "Berhasil ambil fasilitas"))
}

func CreateMethodPayment(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	user := &models.User{}
	email, ok := r.Context().Value(middleware.EmailKey).(string)
	if email == "" || !ok {
		respondError(w, http.StatusBadRequest, "Akun tidak ditemukan")
		return
	}
	if err := db.Where("email = ?", email).First(&user).Error; err != nil {
		respondError(w, http.StatusNotFound, "User tidak ditemukan")
		return
	}

	methodID := r.FormValue("method_id")
	accountNumber := r.FormValue("account_number")

	methodP := models.MethodPayment{}

	method := models.Method{}
	if err := db.Where("id = ?", methodID).First(&method).Error; err != nil {
		respondError(w, http.StatusNotFound, "Metode pembayaran tidak ditemukan")
		return
	}

	err := db.Where("user_id = ?", user.ID).First(&methodP).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		newMethodP := models.MethodPayment{
			AccountNumber: accountNumber,
			Name:          method.Name,
			MethodID:      methodID,
			UserID:        user.ID,
		}
		db.Create(&newMethodP)
		respondJSON(w, http.StatusCreated, newMethodP.ToResponse())
	} else if err == nil {
		db.Model(&methodP).Updates(models.MethodPayment{
			Name:          method.Name,
			AccountNumber: accountNumber,
		})
		respondJSON(w, http.StatusOK, methodP.ToResponse())
	} else {
		respondError(w, http.StatusInternalServerError, "Terjadi kesalahan saat memproses data")
	}
}

func UpdateMethodPayment(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	gym := models.Gym{}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&gym); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}
	defer r.Body.Close()
}
