package models

import (
	"time"

	"gorm.io/gorm"
)

type (
	Gender string
	Role   string
	Status string
)

const (
	Lakilaki  Gender = "laki-Laki"
	Perempuan Gender = "perempuan"
	Admin     Role   = "admin"
	Owner     Role   = "owner"
	Member    Role   = "member"
	True      Status = "true"
	False     Status = "false"
)

type User struct {
	gorm.Model
	ID                uint               `gorm:"primaryKey" json:"id"`
	Name              string             `json:"name"`
	Avatar            string             `json:"avatar"`
	Email             string             `db:"unique;not null" json:"email"`
	Password          string             `json:"password"`
	PhoneNumber       string             `json:"phone_number"`
	Identify          string             `json:"identify"`
	Gender            Gender             `gorm:"type:ENUM('laki-laki', 'perempuan','')" json:"gender"`
	Status            Status             `gorm:"type:ENUM('true', 'false')" json:"status"`
	Role              Role               `gorm:"type:ENUM('admin', 'owner', 'member')" json:"role"`
	Gyms              []Gym              `json:"gym_id"`
	Memberships       []Membership       `json:"membership"`
	MembershipOptions []MembershipOption `json:"membership_option"`
	Transactions      []Transaction
	MethodPayments    MethodPayment
}

func IsValidGender(gender string) string {
	if gender == string(Lakilaki) {
		return string(Lakilaki)
	}
	if gender == string(Perempuan) {
		return string(Lakilaki)
	}
	return ""
}

// Response

type UserResponse struct {
	ID          uint   `json:"id"`
	Name        string `json:"name"`
	Avatar      string `json:"avatar"`
	Email       string `json:"email"`
	PhoneNumber string `json:"phone_number"`
	Role        Role   `json:"role"`
	Gender      Gender `json:"gender"`
	Status      Status `json:"status"`
	CreatedAt   string `json:"created_at"`
	UpdatedAt   string `json:"updated_at"`
}

func (u *User) ToResponse() UserResponse {
	return UserResponse{
		ID:          u.ID,
		Name:        u.Name,
		Avatar:      u.Avatar,
		Email:       u.Email,
		PhoneNumber: u.PhoneNumber,
		Role:        u.Role,
		Gender:      u.Gender,
		Status:      u.Status,
		CreatedAt:   u.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   u.UpdatedAt.Format(time.RFC3339),
	}
}
