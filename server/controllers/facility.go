package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"server/pkg/models"
	"server/utils"

	"gorm.io/gorm"
)

func GetAllFacility(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	fmt.Println("helo")
}

func CreateFacility(db *gorm.DB, w http.ResponseWriter, r *http.Request) {

	hashPassword, _ := utils.HashPassword(r.FormValue("password"))
	fmt.Println(hashPassword)
	user := models.User{
		Name:        r.FormValue("name"),
		Email:       r.FormValue("email"),
		PhoneNumber: r.FormValue("phone_number"),
		Password:    hashPassword,
		Role:        models.Admin,
	}

	db.Create(&user)

	response := user.ToResponse()
	respondJSON(w, http.StatusCreated, response)
	defer r.Body.Close()
}

func DetailFacility(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	user := models.User{}
	result := db.Find(&user)
	respondJSON(w, http.StatusOK, result)
	defer r.Body.Close()
}

func UpdateFacility(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	gym := models.Gym{}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&gym); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}
	defer r.Body.Close()
}

func DeleteFacility(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	gym := models.Gym{}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&gym); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}
	defer r.Body.Close()
}
