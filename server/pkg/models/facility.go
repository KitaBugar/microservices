package models

import (
	"gorm.io/gorm"
)

type Facility struct {
	ID         uint   `gorm:"primaryKey" json:"id"`
	Image      string `gorm:"type:text" json:"image"`
	Name       string `gorm:"type:text;default:null" json:"name"`
	Gyms       []*Gym `gorm:"many2many:gym_facilities;" json:"gyms"`
	gorm.Model `json:"-"`
}
