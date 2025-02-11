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

}
func HandleTransaction(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	owner := &models.User{}
	gym := &models.Gym{}
	transaction := &models.Transaction{}
	membership := &models.Membership{}
	packageData := &models.MembershipOption{}

	// Ambil email dari context (Owner yang login)
	email, ok := r.Context().Value(middleware.EmailKey).(string)
	if email == "" || !ok {
		respondError(w, http.StatusBadRequest, "Akun tidak ditemukan")
		return
	}

	// Cari owner berdasarkan email
	if err := db.Where("email = ?", email).First(&owner).Error; err != nil {
		respondError(w, http.StatusNotFound, "Owner tidak ditemukan")
		return
	}

	// Cari gym yang dimiliki oleh owner ini
	if err := db.Where("owner_id = ?", owner.ID).First(&gym).Error; err != nil {
		respondError(w, http.StatusNotFound, "Gym tidak ditemukan")
		return
	}

	// Ambil user_id dan package_id dari form input
	userID := r.FormValue("user_id")
	packageID := r.FormValue("membership_option_id")
	if userID == "" || packageID == "" {
		respondError(w, http.StatusBadRequest, "User ID dan Paket Membership diperlukan")
		return
	}

	// Cek apakah paket membership valid untuk gym ini
	if err := db.Where("id = ? AND gym_id = ?", packageID, gym.ID).First(&packageData).Error; err != nil {
		respondError(w, http.StatusNotFound, "Paket membership tidak ditemukan untuk gym ini")
		return
	}

	// Cari transaksi berdasarkan user_id, gym_id, dan status pending
	if err := db.Where("user_id = ? AND gym_id = ? AND package_id = ? AND status = ?", userID, gym.ID, packageID, "pending").First(&transaction).Error; err != nil {
		respondError(w, http.StatusNotFound, "Tidak ada transaksi yang perlu dikonfirmasi untuk user ini")
		return
	}

	// Ambil membership terkait transaksi
	if err := db.Where("id = ?", transaction.MembershipID).First(&membership).Error; err != nil {
		respondError(w, http.StatusNotFound, "Membership tidak ditemukan")
		return
	}

	// Ambil aksi dari form input
	action := r.FormValue("action") // "accept" atau "reject"

	if action == "accept" {
		// Jika diterima, ubah status transaksi dan aktifkan membership dengan paket
		transaction.Status = "success"
		membership.Status = "active"

		db.Save(&transaction)
		db.Save(&membership)

		respondJSON(w, http.StatusOK, map[string]interface{}{
			"message":           "Membership berhasil diaktifkan",
			"user_id":           userID,
			"status":            transaction.Status,
			"membership_status": membership.Status,
			"package_name":      packageData.Name,
		})
		return

	} else if action == "cancel" {
		// Jika ditolak, ubah status transaksi lama dan buat transaksi baru
		transaction.Status = "cancel"
		db.Save(&transaction)

		newTransaction := models.Transaction{
			UserID:             transaction.UserID,
			GymID:              transaction.GymID,
			MembershipOptionID: transaction.MembershipID,
			MembershipID:       transaction.MembershipID,
			Status:             "pending",
		}

		if err := db.Create(&newTransaction).Error; err != nil {
			respondError(w, http.StatusInternalServerError, "Gagal membuat transaksi baru")
			return
		}

		respondJSON(w, http.StatusOK, map[string]interface{}{
			"message":            "Transaksi ditolak. User dapat mengajukan ulang dengan memilih paket lagi.",
			"user_id":            userID,
			"package_id":         packageID,
			"new_transaction_id": newTransaction.ID,
		})
		return
	}

	// Jika aksi tidak valid
	respondError(w, http.StatusBadRequest, "Aksi tidak valid")
}
