package models

import (
	"time"

	"gorm.io/gorm"
)

type Membership struct {
	ID                 uint             `gorm:"primaryKey" json:"id"`
	CardNumber         string           `gorm:"type:varchar(100)" json:"card_number"`
	StartDate          time.Time        `json:"start_date"`
	EndDate            time.Time        `db:"unique;not null" json:"end_date"`
	Status             string           `gorm:"type:ENUM('true','false')" json:"status"`
	GymID              uint             `json:"gym_id"`
	MembershipOptionID uint             `json:"membership_id"`
	UserID             uint             `json:"user_id"`
	User               User             `json:"user"`
	MembershipOption   MembershipOption `json:"membership_option"`
	CheckIn            []CheckIn
	Transactions       []Transaction
	gorm.Model         `json:"-"`
}
type MembershipResponse struct {
	ID                 uint             `gorm:"primaryKey" json:"id"`
	CardNumber         string           `gorm:"type:varchar(100)" json:"card_number"`
	StartDate          time.Time        `json:"start_date"`
	EndDate            time.Time        `db:"unique;not null" json:"end_date"`
	Status             string           `gorm:"type:ENUM('true','false')" json:"status"`
	GymID              uint             `json:"gym_id"`
	MembershipOptionID uint             `json:"membership_id"`
	UserID             uint             `json:"user_id"`
	MembershipOption   MembershipOption `json:"membership_option"`
	Transactions       []Transaction
	User               User `json:"user"`
	gorm.Model         `json:"-"`
}

func (u *Membership) MembershipResponse() *MembershipResponse {
	return &MembershipResponse{
		ID:                 u.ID,
		CardNumber:         u.CardNumber,
		StartDate:          u.StartDate,
		EndDate:            u.EndDate,
		Status:             u.Status,
		MembershipOptionID: u.MembershipOptionID,
		UserID:             u.UserID,
		GymID:              u.GymID,
		User:               u.User,
		MembershipOption:   u.MembershipOption,
	}
}
