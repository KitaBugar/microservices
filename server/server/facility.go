package server

import (
	"net/http"
	"server/controllers"
)

func (a *App) getAllFacility(w http.ResponseWriter, r *http.Request) {
	controllers.GetAllFacility(a.DB, w, r)
}
func (a *App) createFacility(w http.ResponseWriter, r *http.Request) {
	controllers.CreateFacility(a.DB, w, r)
}
func (a *App) updateFacility(w http.ResponseWriter, r *http.Request) {
	controllers.UpdateFacility(a.DB, w, r)
}
