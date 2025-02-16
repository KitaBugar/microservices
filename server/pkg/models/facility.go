package models

import (
	"fmt"
	"os"
	"time"

	"gorm.io/gorm"
)

type Facility struct {
	ID         uint   `gorm:"primaryKey" json:"id"`
	Image      string `gorm:"type:text" json:"image"`
	Name       string `gorm:"type:text;default:null" json:"name"`
	Gyms       []*Gym `gorm:"many2many:gym_facilities;" json:"gyms"`
	gorm.Model `json:"-"`
}

type ImageFacility struct {
	Image    string `json:"image"`
	ImageUrl string `json:"image_url"`
}

type FacilityResponse struct {
	ID        uint          `json:"id"`
	Image     ImageFacility `json:"image"`
	Name      string        `json:"name"`
	CreatedAt string        `json:"created_at"`
	UpdatedAt string        `json:"updated_at"`
}

func (u *Facility) ToResponse() *FacilityResponse {
	var images ImageFacility
	images.Image = u.Image
	images.ImageUrl = fmt.Sprintf("%s/assets/facility/%s", os.Getenv("APP_URL"), u.Image)
	return &FacilityResponse{
		ID:        u.ID,
		Name:      u.Name,
		Image:     images,
		CreatedAt: u.CreatedAt.Format(time.RFC3339),
		UpdatedAt: u.UpdatedAt.Format(time.RFC3339),
	}
}
