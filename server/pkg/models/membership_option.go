package models

import (
	"time"

	"gorm.io/gorm"
)

type MembershipOption struct {
	ID           uint   `gorm:"primaryKey" json:"id"`
	Name         string `gorm:"type:varchar(40)" json:"name"`
	Description  string `json:"description"`
	Features     string `gorm:"type:json" json:"features"`
	Price        int    `json:"price"`
	GymID        uint   `json:"gym"`
	UserID       uint   `json:"user"`
	Memberships  []Membership
	Transactions []Transaction
	gorm.Model   `json:"-"`
}

// REsponse
type MembershipOptionResponse struct {
	ID          uint        `json:"id"`
	Name        string      `json:"name"`
	Description string      `json:"description"`
	Features    string      `json:"operating_hours"`
	Price       int         `json:"address"`
	UserID      uint        `json:"user"`
	Gym         uint        `json:"gym"`
	CreatedAt   string      `json:"created_at"`
	UpdatedAt   string      `json:"updated_at"`
	Facilities  []*Facility `json:"facilities"`
}

func (u *MembershipOption) ToResponse() *MembershipOptionResponse {
	return &MembershipOptionResponse{
		ID:          u.ID,
		Name:        u.Name,
		Description: u.Description,
		Features:    u.Features,
		Price:       u.Price,
		UserID:      u.UserID,
		CreatedAt:   u.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   u.UpdatedAt.Format(time.RFC3339),
		Gym:         u.GymID,
	}
}
