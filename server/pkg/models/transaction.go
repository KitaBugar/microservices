package models

import "gorm.io/gorm"

type Transaction struct {
	ID                 int    `gorm:"primaryKey"`
	Image              string `gorm:"type:varchar(100);not null"`
	MethodName         string `gorm:"type:varchar(50);not null"`
	AccountNumber      string `gorm:"type:varchar(30);not null"`
	Status             string `gorm:"type:ENUM('success', 'pending', 'cancel')"`
	Price              int    `gorm:"not null"`
	MembershipOptionID int    `json:"membership_option"`
	UserID             int    `json:"user"`
	GymID              int    `json:"gym"`
	gorm.Model         `json:"-"`
}
