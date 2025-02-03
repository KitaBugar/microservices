package models

import (
	"gorm.io/gorm"
)

type Method struct {
	ID             uint   `gorm:"primaryKey" json:"id"`
	Name           string `json:"name"`
	Image          string `json:"account_number"`
	MethodPayments []MethodPayment
	gorm.Model     `json:"-"`
}
