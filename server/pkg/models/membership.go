package models

import (
	"time"

	"gorm.io/gorm"
)

type Membership struct {
	ID                 uint      `gorm:"primaryKey" json:"id"`
	CardNumber         string    `gorm:"type:varchar(100)" json:"card_number"`
	StartDate          time.Time `json:"start_date"`
	EndDate            time.Time `db:"unique;not null" json:"end_date"`
	Status             string    `gorm:"type:ENUM('true','false')" json:"status"`
	GymID              uint      `json:"gym_id"`
	MembershipOptionID uint      `json:"membership_id"`
	UserID             uint      `json:"user_id"`
	gorm.Model         `json:"-"`
}
