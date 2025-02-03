package models

import (
	"gorm.io/gorm"
)

type MethodPayment struct {
	ID            uint   `gorm:"primaryKey" json:"id"`
	Name          string `json:"name"`
	AccountNumber string `json:"account_number"`
	MethodID      string `json:"method"`
	UserID        string `db:"unique;not null" json:"user"`
	gorm.Model    `json:"-"`
}
