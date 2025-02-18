package models

import (
	"fmt"
	"os"
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
	gorm.Model        `json:"-"`
	ID                uint               `gorm:"primaryKey" json:"id"`
	Name              string             `json:"name"`
	Avatar            string             `json:"avatar"`
	Email             string             `db:"unique;not null" json:"email"`
	Password          string             `json:"-"`
	PhoneNumber       string             `json:"phone_number"`
	Identify          string             `json:"identify"`
	IdentifyStatus    *string            `gorm:"type:ENUM('success', 'pending', 'cancel')" json:"identify_status"`
	Gender            Gender             `gorm:"type:ENUM('laki-laki', 'perempuan','')" json:"gender"`
	Status            Status             `gorm:"type:ENUM('true', 'false')" json:"status"`
	Role              string             `gorm:"type:ENUM('admin', 'owner', 'member')" json:"role"`
	Gyms              []Gym              `json:"gym_id"`
	Memberships       []Membership       `json:"membership"`
	MembershipOptions []MembershipOption `json:"membership_option"`
	Transactions      []Transaction

	MethodPayment MethodPayment `json:"method_payment"`
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

type AvatarImage struct {
	Url      string `json:"url"`
	ImageUrl string `json:"image_url"`
}

type UserResponse struct {
	ID             uint          `json:"id"`
	Name           string        `json:"name"`
	Avatar         AvatarImage   `json:"avatar"`
	Email          string        `json:"email"`
	PhoneNumber    string        `json:"phone_number"`
	Role           string        `json:"role"`
	Identify       string        `json:"identify"`
	IdentifyStatus *string       `json:"identify_status"`
	Gender         Gender        `json:"gender"`
	Status         Status        `json:"status"`
	CreatedAt      string        `json:"created_at"`
	UpdatedAt      string        `json:"updated_at"`
	MethodPayment  MethodPayment `json:"method_payment"`
}

func (u *User) ToResponse() UserResponse {
	var image AvatarImage
	image.Url = u.Avatar
	image.ImageUrl = fmt.Sprintf("%s/assets/avatar/%s", os.Getenv("APP_URL"), u.Avatar)
	return UserResponse{
		ID:             u.ID,
		Name:           u.Name,
		Avatar:         image,
		Email:          u.Email,
		PhoneNumber:    u.PhoneNumber,
		Identify:       u.Identify,
		IdentifyStatus: u.IdentifyStatus,
		Role:           u.Role,
		Gender:         u.Gender,
		Status:         u.Status,
		CreatedAt:      u.CreatedAt.Format(time.RFC3339),
		UpdatedAt:      u.UpdatedAt.Format(time.RFC3339),
		MethodPayment:  u.MethodPayment,
	}
}
