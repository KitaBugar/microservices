package server

import (
	"net/http"
	"server/controllers"
)

func (a *App) getAllMembershipOptions(w http.ResponseWriter, r *http.Request) {
	controllers.GetAllMembershipOptions(a.DB, w, r)
}
func (a *App) createMembershipOptions(w http.ResponseWriter, r *http.Request) {
	controllers.CreateMembershipOptions(a.DB, w, r)
}
