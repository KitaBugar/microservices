package controllers

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"server/middleware"
	"server/pkg/models"
	"server/utils"
	"time"

	"gorm.io/gorm"
)

func ListMembership(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	user := &models.User{}
	membership := &[]models.Membership{}
	email, ok := r.Context().Value(middleware.EmailKey).(string)
	if email == "" || !ok {
		respondError(w, http.StatusBadRequest, "Akun tidak ditemukan")
		return
	}
	db.Where("email = ?", email).First(&user)
	result := db.Scopes(utils.Paginate(r)).Model(&models.Membership{}).Preload("Gyms").Where("user_id = ?", user.ID).Find(&membership).Error
	if result != nil {
		respondJSON(w, http.StatusOK, utils.Response{Items: "", Message: "Belum ada membership"})
		return
	}
	respondJSON(w, http.StatusOK, utils.Response{Items: membership})

}

func BuyMembership(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	user := &models.User{}
	member := &models.Membership{}
	gym := &models.Gym{}
	memberOp := &models.MembershipOption{}
	methodPay := &models.MethodPayment{}
	transaction := &models.Transaction{}

	email, ok := r.Context().Value(middleware.EmailKey).(string)
	if email == "" || !ok {
		respondError(w, http.StatusBadRequest, "Akun tidak ditemukan")
		return
	}
	db.Where("email = ?", email).First(&user)
	gID, err := utils.ConvertStringToNumber(r.FormValue("gym_id"))
	if err != nil {
		respondError(w, http.StatusBadRequest, "Gym not found")
		return
	}
	uID := user.ID
	memberOpID, err := utils.ConvertStringToNumber(r.FormValue("membership_option_id"))
	if err != nil {
		respondError(w, http.StatusBadRequest, "Method Option not found")
		return

	}
	methodPayID, err := utils.ConvertStringToNumber(r.FormValue("method_payment_id"))
	if err != nil {
		respondError(w, http.StatusBadRequest, "Method Payment not found")
		return
	}
	db.First(&user, uID)
	db.First(&gym, gID)
	db.First(&memberOp, memberOpID)
	db.First(&methodPay, methodPayID)

	layout := "2006-01-02"
	endDateP, _ := time.Parse(layout, r.FormValue("end_date"))
	err = db.Where("user_id = ?", user.ID).
		Where("gym_id = ?", gID).
		Where("membership_option_id = ?", memberOp.ID).
		First(&member).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		newMember := models.Membership{
			UserID:             user.ID,
			GymID:              gym.ID,
			MembershipOptionID: memberOp.ID,
			StartDate:          time.Now(),
			EndDate:            endDateP,
			Status:             "false",
		}
		db.Create(&newMember)
		transaction.MembershipID = int(newMember.ID)
	} else {
		db.Model(&member).Updates(map[string]interface{}{
			"card_number": nil,
			"start_date":  time.Now(),
			"end_date":    endDateP,
			"status":      "false",
		})
		transaction.MembershipID = int(member.ID)
	}
	uploadedFile, handler, err := r.FormFile("photo_transaction")
	if err == nil || uploadedFile == nil {
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
			dateStr := time.Now().Format("20060102150405")
			filename := fmt.Sprintf("IMG_transaction_%s%s", dateStr, filepath.Ext(handler.Filename))
			fileLocation := filepath.Join(dir, "public/transaction", filename)
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
			transaction.Image = filename
			transaction.MethodName = methodPay.Name
			transaction.AccountNumber = methodPay.AccountNumber
			transaction.Status = "pending"
			transaction.Price = memberOp.Price
			transaction.MembershipOptionID = memberOpID
			transaction.UserID = int(uID)
			transaction.GymID = int(gID)
			db.Create(&transaction)
		} else {
			respondError(w, http.StatusBadRequest, "Foto transaksi harus ada")
			return
		}
	}

	respondJSON(w, http.StatusCreated, map[string]interface{}{
		"items": map[string]interface{}{
			"transaction": transaction.TransactionResponse(),
			"membership":  member,
		},
		"message": "Berhasil membuat transaksi",
	})

}

func DetailMembership() {

}
