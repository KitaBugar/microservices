package models

import (
	jwt "github.com/golang-jwt/jwt"
	"gorm.io/gorm"
)

type Claims struct {
	ID    uint   `gorm:"primaryKey"`
	Email string `json:"email"`
	jwt.StandardClaims
	gorm.Model
}
