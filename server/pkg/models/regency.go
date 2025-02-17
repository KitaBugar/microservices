package models

type Regency struct {
	ID   uint   `gorm:"primaryKey" json:"id"`
	Code int    `json:"code"`
	Name string `json:"name"`
}
