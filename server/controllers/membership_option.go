package controllers

import (
	"net/http"
	"server/pkg/models"
	"server/utils"

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

}
func UpdateMembershipOptions(db *gorm.DB, w http.ResponseWriter, r *http.Request) {

}
