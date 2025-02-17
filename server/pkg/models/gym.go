package models

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/gorm"
)

type ImageResponse struct {
	Image    string `json:"image"`
	ImageUrl string `json:"image_url"`
}

type Gym struct {
	ID                uint   `gorm:"primaryKey" json:"id"`
	Name              string `gorm:"not null" validate:"required" json:"name"`
	Images            string `gorm:"type:json" json:"image"`
	Description       string `gorm:"type:text;default:null" validate:"required"  json:"description"`
	StartTime         string `json:"start_time" validate:"required"`
	EndTime           string `json:"end_time" validate:"required"`
	Address           string `gorm:"type:text;default:null" validate:"required" json:"address"`
	CityID            uint   `gorm:"not null" json:"city_id"`
	ProvinceID        uint   `gorm:"not null" json:"province_id"`
	UserID            uint   `gorm:"not null" json:"user_id"`
	User              User   `json:"user"`
	Memberships       []Membership
	Facilities        []*Facility        `gorm:"many2many:gym_facilities" json:"facilities"`
	MembershipOptions []MembershipOption `json:",omitempty"`
	Transactions      []Transaction
	Regency           Regency  `gorm:"foreignKey:CityID;references:ID" json:"city"`
	Province          Province `gorm:"foreignKey:ProvinceID;references:ID" json:"province"`
	gorm.Model        `json:"-"`
}

// Response
type GymResponse struct {
	ID                uint               `json:"id"`
	Name              string             `json:"name"`
	Images            []ImageResponse    `json:"image"`
	Description       string             `json:"description"`
	StartTime         string             `json:"start_time" validate:"required"`
	EndTime           string             `json:"end_time" validate:"required"`
	Address           string             `json:"address"`
	CityID            uint               `json:"city_id"`
	ProvinceID        uint               `json:"province_id"`
	UserID            uint               `json:"user_id"`
	CreatedAt         string             `json:"created_at"`
	UpdatedAt         string             `json:"updated_at"`
	MembershipOptions []MembershipOption `json:"membership_option"`
	User              User               `json:"user"`
	Facilities        []*Facility        `json:"facility"`
	Memberships       []Membership       `json:"membership,omitempty"`
	Regency           Regency            `json:"city"`
	Province          Province           `json:"province"`
}

func (u *Gym) ToResponse() *GymResponse {
	var imageNames []string
	if u.Images != "" {
		if err := json.Unmarshal([]byte(u.Images), &imageNames); err != nil {
			log.Println("Error parsing images:", err)
			imageNames = []string{}
		}
	}

	var images []ImageResponse
	for _, img := range imageNames {
		images = append(images, ImageResponse{
			Image:    img,
			ImageUrl: fmt.Sprintf("%s/assets/image_banner/%s", os.Getenv("APP_URL"), img),
		})

	}
	return &GymResponse{
		ID:                u.ID,
		Name:              u.Name,
		Images:            images,
		Description:       u.Description,
		StartTime:         u.StartTime,
		EndTime:           u.EndTime,
		Address:           u.Address,
		CityID:            u.CityID,
		ProvinceID:        u.ProvinceID,
		UserID:            u.UserID,
		User:              u.User,
		CreatedAt:         u.CreatedAt.Format(time.RFC3339),
		UpdatedAt:         u.UpdatedAt.Format(time.RFC3339),
		MembershipOptions: u.MembershipOptions,
		Facilities:        u.Facilities,
		Memberships:       u.Memberships,
		Regency:           u.Regency,
		Province:          u.Province,
	}
}
