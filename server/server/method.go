package server

import (
	"net/http"
	"server/controllers"
)

func (a *App) getAllMethod(w http.ResponseWriter, r *http.Request) {
	controllers.GetAllMethod(a.DB, w, r)
}
func (a *App) createMethod(w http.ResponseWriter, r *http.Request) {
	controllers.CreateMethod(a.DB, w, r)
}
func (a *App) updateMethod(w http.ResponseWriter, r *http.Request) {
	controllers.UpdateMethod(a.DB, w, r)
}
