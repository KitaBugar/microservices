package controllers

import (
	"net/http"
	"server/pkg/models"
	"server/utils"

	"gorm.io/gorm"
)

func GetAllProvince(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	province := []models.Province{}
	db.Find(&province)
	respondJSON(w, http.StatusOK, utils.Response{
		Items: province,
	})
}
func GetAllRegency(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	regency := []models.Regency{}
	db.Find(&regency)
	respondJSON(w, http.StatusOK, utils.Response{
		Items: regency,
	})
}
func ProvinceById(db *gorm.DB, w http.ResponseWriter, r *http.Request) {

}
func RegencyById(db *gorm.DB, w http.ResponseWriter, r *http.Request) {

}
