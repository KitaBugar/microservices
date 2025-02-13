package server

import (
	"net/http"
	"server/controllers"
)

func (a *App) getAllKtp(w http.ResponseWriter, r *http.Request) {
	controllers.GetAllKtp(a.DB, w, r)
}
func (a *App) updateConfirmKtp(w http.ResponseWriter, r *http.Request) {
	controllers.UpdateConfirmKtp(a.DB, w, r)
}
