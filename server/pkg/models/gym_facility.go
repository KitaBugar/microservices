package models

type GymFacility struct {
	GymID      int `gorm:"primaryKey"`
	FacilityID int `gorm:"primaryKey"`
}
