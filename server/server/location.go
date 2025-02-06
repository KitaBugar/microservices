package server

import (
	"net/http"
	"server/controllers"
)

func (a *App) getAllProvince(w http.ResponseWriter, r *http.Request) {
	controllers.GetAllProvince(a.DB, w, r)
}

func (a *App) getAllRegency(w http.ResponseWriter, r *http.Request) {
	controllers.GetAllRegency(a.DB, w, r)

}
func (a *App) provinceById(w http.ResponseWriter, r *http.Request) {
	controllers.ProvinceById(a.DB, w, r)

}
func (a *App) regencyById(w http.ResponseWriter, r *http.Request) {
	controllers.RegencyById(a.DB, w, r)
}
