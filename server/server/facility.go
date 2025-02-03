package server

import (
	"net/http"
	"server/controllers"
)

//	func (a *App) getAllFacility(w http.ResponseWriter, r *http.Request) {
//		controllers.GetAllFacility()(a.DB, w, r)
//	}
func (a *App) createFacility(w http.ResponseWriter, r *http.Request) {
	controllers.BuyMembership(a.DB, w, r)
}
