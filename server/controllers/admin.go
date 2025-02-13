package controllers

import (
	"net/http"
	"server/middleware"
	"server/pkg/models"
	"server/utils"
	"strconv"

	"gorm.io/gorm"
)

func GetAllKtp(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	user := &[]models.User{}
	email, ok := r.Context().Value(middleware.EmailKey).(string)
	if email == "" || !ok {
		respondError(w, http.StatusBadRequest, "Akun tidak ditemukan")
		return
	}
	db.Where("email = ?", email).First(&user)
	result := db.Model(&models.User{}).Where("identify_status = ?", "pending").Find(&user)
	if result.Error != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	respondJSON(w, http.StatusOK, utils.ToResponse(r, user, "Success"))
}
func UpdateConfirmKtp(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	var is *string
	uID, _ := strconv.Atoi(r.FormValue("user_id"))
	user := &models.User{
		ID: uint(uID),
	}
	form := r.FormValue("confirmation")
	var message string
	if form == "success" {
		is = &form
		db.Model(&user).Updates(models.User{
			IdentifyStatus: is,
		})
		message = "Berhasil mengizinkan owner"
	} else {
		cancel := "cancel"
		is = &cancel
		db.Model(&user).Updates(models.User{
			IdentifyStatus: is,
		})
		message = "Berhasil menolak owner"
	}

	respondJSON(w, http.StatusOK, utils.Response{
		Items:   user,
		Message: message,
	})
}
