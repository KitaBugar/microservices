package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"server/pkg/models"
	"server/utils"
	"strconv"

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
	membershipOptions := []models.MembershipOption{}
	membershipCount := 0
	for {
		name := r.FormValue(fmt.Sprintf("membership_options[%d].name", membershipCount))
		price := r.FormValue(fmt.Sprintf("membership_options[%d].price", membershipCount))
		if name == "" && price == "" {
			break
		}
		membershipCount++
	}
	for i := 0; i < membershipCount; i++ {
		nameKey := fmt.Sprintf("membership_options[%d].name", i)
		descriptionKey := fmt.Sprintf("membership_options[%d].description", i)
		priceKey := fmt.Sprintf("membership_options[%d].price", i)
		featuresKey := fmt.Sprintf("membership_options[%d].features", i)

		name := r.FormValue(nameKey)
		description := r.FormValue(descriptionKey)
		priceStr := r.FormValue(priceKey)

		if priceStr == "" {
			fmt.Println(priceStr)
			respondError(w, http.StatusBadRequest, fmt.Sprintf("Price is required for membership option %d", i))
			return
		}

		featuresJSON := r.FormValue(featuresKey)
		price, err := strconv.Atoi(priceStr)

		if err != nil {
			respondError(w, http.StatusBadRequest, err.Error())
			return
		}

		var features []string
		if err := json.Unmarshal([]byte(featuresJSON), &features); err != nil {
			http.Error(w, "Invalid JSON format for features", http.StatusBadRequest)
			return
		}
		featuresBytes, _ := json.Marshal(features)
		membershipOptions = append(membershipOptions, models.MembershipOption{
			Name:        name,
			Description: description,
			Price:       price,
			Features:    string(featuresBytes),
			UserID:      user.ID,
			GymID:       gym.ID,
		})
	}

	if len(membershipOptions) > 0 {
		db.Create(&membershipOptions)
	}
	respondJSON(w, http.StatusOK, gym.ToResponse())
}
func UpdateMembershipOptions(db *gorm.DB, w http.ResponseWriter, r *http.Request) {

}
