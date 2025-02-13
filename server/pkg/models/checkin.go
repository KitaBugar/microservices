package models

import (
	"time"

	"gorm.io/gorm"
)

type CheckIn struct {
	ID           uint       `gorm:"primaryKey"`
	Name         string     `json:"name"`
	MembershipID uint       `json:"membership_id"`
	Membership   Membership `json:"membership"`
	GymID        uint       `json:"gym"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
	gorm.Model   `json:"-"`
}
