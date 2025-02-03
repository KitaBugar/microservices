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
	OperatingHours    string `json:"operating_hours" validate:"required"`
	Address           string `gorm:"type:text;default:null" validate:"required" json:"address"`
	CityID            int    `gorm:"not null" json:"city_id"`
	ProvinceID        int    `gorm:"not null" json:"province_id"`
	UserID            uint   `gorm:"not null" json:"user_id"`
	Memberships       []Membership
	Facilities        []*Facility `gorm:"many2many:gym_facilities" json:"facilities"`
	MembershipOptions []MembershipOption
	Transactions      []Transaction
	gorm.Model        `json:"-"`
}

// Response
type GymResponse struct {
	ID             uint            `json:"id"`
	Name           string          `json:"name"`
	Images         []ImageResponse `json:"image"`
	Description    string          `json:"description"`
	OperatingHours string          `json:"operating_hours"`
	Address        string          `json:"address"`
	CityID         int             `json:"city_id"`
	ProvinceID     int             `json:"province_id"`
	UserID         uint            `json:"user_id"`
	CreatedAt      string          `json:"created_at"`
	UpdatedAt      string          `json:"updated_at"`
	Facilities     []*Facility     `json:"facilities"`
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
		ID:             u.ID,
		Name:           u.Name,
		Images:         images,
		Description:    u.Description,
		OperatingHours: u.OperatingHours,
		Address:        u.Address,
		CityID:         u.CityID,
		ProvinceID:     u.ProvinceID,
		UserID:         u.UserID,
		CreatedAt:      u.CreatedAt.Format(time.RFC3339),
		UpdatedAt:      u.UpdatedAt.Format(time.RFC3339),
		Facilities:     u.Facilities,
	}
}
