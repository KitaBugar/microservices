package controllers

import (
	"net/http"
	"server/middleware"
	"server/pkg/models"
	"server/utils"

	"gorm.io/gorm"
)

func GetAllTransaction() {

}
func GetAllGymOwner(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	var gyms []models.Gym
	user := &models.User{}
	email, ok := r.Context().Value(middleware.EmailKey).(string)
	if email == "" || !ok {
		respondError(w, http.StatusBadRequest, "Akun tidak ditemukan")
		return
	}
	db.Where("email = ?", email).First(&user)
	result := db.Model(&models.Gym{}).Preload("Facilities").Preload("MembershipOptions").Where("user_id = ?", user.ID).Find(&gyms)
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
func ConfirmTransaction() {

}
