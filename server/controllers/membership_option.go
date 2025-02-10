package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"server/pkg/models"
	"server/utils"
	"strconv"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

func GetAllMembershipOptions(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	m := &models.MembershipOption{}
	q := r.URL.Query()
	g := q.Get("gym_id")
	GymID, err := utils.ConvertStringToNumber(g)
	if err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}
	result := db.First(&m, GymID)
	if result.Error != nil {
		respondError(w, http.StatusBadRequest, result.Error.Error())
		return
	}
	respondJSON(w, http.StatusOK, m.ToResponse())
}

func CreateMembershipOptions(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	str, ok := vars["gymID"]
	if !ok {
		respondError(w, http.StatusBadRequest, "Missing gym id")
		return
	}

	gymID, err := strconv.Atoi(str)
	if err != nil {
		respondError(w, http.StatusBadRequest, "Invalid gym id")
		return
	}

	membershipOptions := models.MembershipOption{}
	gym := &models.Gym{}
	db.Preload("MembershipOptions").First(&gym, gymID)

	name := r.FormValue("name")
	description := r.FormValue("description")
	priceStr := r.FormValue("price")

	if priceStr == "" {
		fmt.Println(priceStr)
		respondError(w, http.StatusBadRequest, "Price is required for membership option")
		return
	}
	price, err := strconv.Atoi(priceStr)
	if err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}
	featureJSON, _ := json.Marshal(r.Form["features"])
	membershipOptions = models.MembershipOption{
		Name:        name,
		Description: description,
		Price:       price,
		Features:    string(featureJSON),
		UserID:      gym.UserID,
		GymID:       gym.ID,
	}
	db.Create(&membershipOptions)

	respondJSON(w, http.StatusOK, gym.ToResponse())
}
func UpdateMembershipOptions(db *gorm.DB, w http.ResponseWriter, r *http.Request) {

}
