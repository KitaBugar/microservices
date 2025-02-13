package models

import (
	"fmt"
	"os"

	"gorm.io/gorm"
)

type ImageTransaction struct {
	Image    string `json:"image"`
	ImageUrl string `json:"image_url"`
}

type Transaction struct {
	ID                 int    `gorm:"primaryKey"`
	Image              string `gorm:"type:varchar(100);not null"`
	MethodName         string `gorm:"type:varchar(50);not null"`
	AccountNumber      string `gorm:"type:varchar(30);not null"`
	Status             string `gorm:"type:ENUM('success', 'pending', 'cancel')"`
	Price              int    `gorm:"not null"`
	MembershipID       int    `json:"membership"`
	MembershipOptionID int    `json:"membership_option"`
	UserID             int    `json:"user"`
	GymID              int    `json:"gym"`
	gorm.Model         `json:"-"`
}

type TransactionResponse struct {
	ID                 int              `gorm:"primaryKey" json:"id"`
	Image              ImageTransaction `gorm:"type:varchar(100);not null" json:"image"`
	MethodName         string           `gorm:"type:varchar(50);not null" json:"method_name"`
	AccountNumber      string           `gorm:"type:varchar(30);not null" json:"account_number"`
	Status             string           `gorm:"type:ENUM('success', 'pending', 'cancel')" json:"status"`
	Price              int              `gorm:"not null" json:"price"`
	MembershipID       int              `json:"membership"`
	MembershipOptionID int              `json:"membership_option"`
	UserID             int              `json:"user"`
	GymID              int              `json:"gym"`
	gorm.Model         `json:"-"`
}

func (u *Transaction) TransactionResponse() *TransactionResponse {
	return &TransactionResponse{
		Image: ImageTransaction{
			Image:    u.Image,
			ImageUrl: fmt.Sprintf("%s/assets/transaction/%s", os.Getenv("APP_URL"), u.Image),
		},
		MethodName:         u.MethodName,
		AccountNumber:      u.AccountNumber,
		Status:             u.Status,
		Price:              u.Price,
		MembershipID:       u.MembershipID,
		MembershipOptionID: u.MembershipOptionID,
		UserID:             u.UserID,
		GymID:              u.GymID,
	}
}
