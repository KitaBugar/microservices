package controllers

import (
	"net/http"
	"server/middleware"
	"server/pkg/models"
	"server/utils"

	"gorm.io/gorm"
)

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
func GetAllTransaction(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	user := &models.User{}
	email, ok := r.Context().Value(middleware.EmailKey).(string)
	if !ok || email == "" {
		respondError(w, http.StatusUnauthorized, "Akun tidak ditemukan")
		return
	}

	if err := db.Where("email = ?", email).First(&user).Error; err != nil {
		respondError(w, http.StatusNotFound, "User tidak ditemukan")
		return
	}

	var transactions []models.Transaction
	err := db.Preload("User").Raw(`
				SELECT t.*
				FROM transactions t
				JOIN memberships m ON t.membership_id = m.id
				JOIN gyms g ON m.gym_id = g.id
				JOIN users u ON t.user_id = u.id
				WHERE t.status = 'pending'
				AND m.status = 'false'
				AND g.user_id = ?
				AND t.created_at = (
					SELECT MAX(t2.created_at)
					FROM transactions t2
					WHERE t2.membership_id = t.membership_id
				)
				ORDER BY t.membership_id;
			`, user.ID).Scan(&transactions).Error
	if err != nil {
		respondError(w, http.StatusInternalServerError, "Gagal mengambil data transaksi")
		return
	}

	for i := range transactions {
		db.Preload("User").Preload("Gym").Preload("MembershipOption").First(&transactions[i], transactions[i].ID)
	}

	var data []models.TransactionResponse
	for _, tr := range transactions {
		data = append(data, *tr.TransactionResponse())
	}

	respondJSON(w, http.StatusOK, utils.Response{
		Items:   data,
		Message: "Success get transactions",
	})
}
func HandleTransaction(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	tID, _ := utils.ConvertStringToNumber(r.FormValue("transaction_id"))
	mID, _ := utils.ConvertStringToNumber(r.FormValue("membership_id"))
	acc := r.FormValue("confirmation")
	t := &models.Transaction{
		ID: tID,
	}
	m := &models.Membership{
		ID: uint(mID),
	}
	db.Find(&t).Updates(models.Transaction{
		Status: acc,
	})
	if acc == "success" {
		db.Find(&m).Updates(models.Transaction{
			Status: "true",
		})
	} else {
		db.Find(&m).Updates(models.Transaction{
			Status: "false",
		})
	}
	res := make(map[string]interface{})
	res["transaction"] = t
	res["membership"] = m
	respondJSON(w, http.StatusOK, utils.Response{
		Message: "Successful confirmation the transaction",
		Items:   res,
	})
}
