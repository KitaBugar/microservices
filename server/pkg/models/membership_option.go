package models

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"

	"gorm.io/gorm"
)

type StringArray []string

// Membaca data dari database dan mengubahnya menjadi []string
func (s *StringArray) Scan(value interface{}) error {
	if value == nil {
		*s = StringArray{}
		return nil
	}

	bytes, ok := value.([]byte)
	if !ok {
		return fmt.Errorf("Scan source is not []byte")
	}

	return json.Unmarshal(bytes, s)
}

// Menyimpan []string sebagai JSON dalam database
func (s StringArray) Value() (driver.Value, error) {
	return json.Marshal(s)
}

type MembershipOption struct {
	ID          uint          `gorm:"primaryKey" json:"id"`
	Name        string        `gorm:"type:varchar(40)" json:"name"`
	Description string        `json:"description"`
	Features    StringArray   `gorm:"type:json" json:"features,omitempty"`
	Price       int           `json:"price"`
	GymID       uint          `json:"gym_id"`
	UserID      uint          `json:"user_id"`
	Memberships []Membership  `json:",omitempty"`
	Transaction []Transaction `json:",omitempty"`
	gorm.Model  `json:"-"`
}

// REsponse
type MembershipOptionResponse struct {
	ID          uint        `json:"id"`
	Name        string      `json:"name"`
	Description string      `json:"description"`
	Features    StringArray `json:"operating_hours"`
	Price       int         `json:"address"`
	UserID      uint        `json:"user_id"`
	Gym         uint        `json:"gym"`
	CreatedAt   string      `json:"created_at"`
	UpdatedAt   string      `json:"updated_at"`
	Facilities  []*Facility `json:"facility"`
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
