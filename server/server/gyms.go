package server

import (
	"net/http"
	"server/controllers"
)

func (a *App) getAllGym(w http.ResponseWriter, r *http.Request) {
	controllers.GetAllGym(a.DB, w, r)
}
func (a *App) createGym(w http.ResponseWriter, r *http.Request) {
	controllers.CreateGym(a.DB, w, r)
}
func (a *App) detailGym(w http.ResponseWriter, r *http.Request) {
	controllers.DetailGym(a.DB, w, r)
}
func (a *App) updateGym(w http.ResponseWriter, r *http.Request) {
	controllers.UpdateGym(a.DB, w, r)
}
func (a *App) deleteGym(w http.ResponseWriter, r *http.Request) {
	controllers.DeleteGym(a.DB, w, r)
}
func (a *App) getCheckInGym(w http.ResponseWriter, r *http.Request) {
	controllers.GetCheckInGym(a.DB, w, r)
}
func (a *App) createCheckInGym(w http.ResponseWriter, r *http.Request) {
	controllers.CreateCheckInGym(a.DB, w, r)
}
