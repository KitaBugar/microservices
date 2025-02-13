package models

import (
	"gorm.io/gorm"
)

type CheckIn struct {
	ID         uint   `gorm:"primaryKey"`
	Name       string `json:"name"`
	Membership string `json:"membership"`
	gorm.Model
}
