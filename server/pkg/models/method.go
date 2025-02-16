package models

import (
	"fmt"
	"os"
	"time"

	"gorm.io/gorm"
)

type Method struct {
	ID             uint   `gorm:"primaryKey" json:"id"`
	Name           string `json:"name"`
	Image          string `json:"image"`
	MethodPayments []MethodPayment
	gorm.Model     `json:"-"`
}

type ImageMethod struct {
	Image    string `json:"image"`
	ImageUrl string `json:"image_url"`
}
type MethodResponse struct {
	ID        uint        `json:"id"`
	Name      string      `json:"name"`
	Image     ImageMethod `json:"image"`
	CreatedAt string      `json:"created_at"`
	UpdatedAt string      `json:"updated_at"`
}

func (u *Method) ToResponse() *MethodResponse {

	return &MethodResponse{
		ID:   u.ID,
		Name: u.Name,
		Image: ImageMethod{
			Image:    u.Image,
			ImageUrl: fmt.Sprintf("%s/assets/method/%s", os.Getenv("APP_URL"), u.Image),
		},
		CreatedAt: u.CreatedAt.Format(time.RFC3339),
		UpdatedAt: u.UpdatedAt.Format(time.RFC3339),
	}
}
