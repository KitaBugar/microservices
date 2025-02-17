package models

type Province struct {
	ID   uint   `gorm:"primaryKey" json:"id"`
	Name string `json:"name"`
}
