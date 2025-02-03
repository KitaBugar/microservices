package server

import (
	"net/http"
	"server/controllers"
)

func (a *App) listMembership(w http.ResponseWriter, r *http.Request) {
	controllers.ListMembership(a.DB, w, r)
}
func (a *App) buyMembership(w http.ResponseWriter, r *http.Request) {
	controllers.BuyMembership(a.DB, w, r)
}
