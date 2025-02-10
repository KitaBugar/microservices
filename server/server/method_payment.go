package server

import (
	"net/http"
	"server/controllers"
)

func (a *App) getMethodPayment(w http.ResponseWriter, r *http.Request) {
	controllers.GetMethodPayment(a.DB, w, r)
}
func (a *App) createMethodPayment(w http.ResponseWriter, r *http.Request) {
	controllers.CreateMethodPayment(a.DB, w, r)
}
func (a *App) updateMethodPayment(w http.ResponseWriter, r *http.Request) {
	controllers.UpdateMethodPayment(a.DB, w, r)
}
