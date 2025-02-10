package models

import (
	"time"

	"gorm.io/gorm"
)

type MethodPayment struct {
	ID            uint   `gorm:"primaryKey" json:"id"`
	Name          string `json:"name"`
	AccountNumber string `json:"account_number"`
	MethodID      string `json:"method"`
	UserID        uint   `db:"unique;not null" json:"user"`
	gorm.Model    `json:"-"`
}

type MethodPResponse struct {
	ID            uint   `json:"id"`
	Name          string `json:"name"`
	AccountNumber string `json:"account_number"`
	CreatedAt     string `json:"created_at"`
	UpdatedAt     string `json:"updated_at"`
}

func (u *MethodPayment) ToResponse() *MethodPResponse {

	return &MethodPResponse{
		ID:        u.ID,
		Name:      u.Name,
		CreatedAt: u.CreatedAt.Format(time.RFC3339),
		UpdatedAt: u.UpdatedAt.Format(time.RFC3339),
	}
}
