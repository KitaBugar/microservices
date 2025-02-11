package server

import (
	"net/http"
	"server/controllers"
)

func (a *App) getAllGymOwner(w http.ResponseWriter, r *http.Request) {
	controllers.GetAllGymOwner(a.DB, w, r)
}
func (a *App) getAllTransaction(w http.ResponseWriter, r *http.Request) {
	controllers.GetAllTransaction(a.DB, w, r)
}
func (a *App) handleTransaction(w http.ResponseWriter, r *http.Request) {
	controllers.HandleTransaction(a.DB, w, r)
}
