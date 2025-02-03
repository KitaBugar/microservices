package server

import (
	"net/http"
	"server/controllers"
)

func (a *App) getUser(w http.ResponseWriter, r *http.Request) {
	controllers.GetAllUser(a.DB, w, r)
}
func (a *App) createUser(w http.ResponseWriter, r *http.Request) {
	controllers.CreateUser(a.DB, w, r)
}
func (a *App) detailUser(w http.ResponseWriter, r *http.Request) {
	controllers.DetailUser(a.DB, w, r)
}
func (a *App) updateUser(w http.ResponseWriter, r *http.Request) {
	controllers.UpdateUser(a.DB, w, r)
}
func (a *App) deleteUser(w http.ResponseWriter, r *http.Request) {
	controllers.DeleteUser(a.DB, w, r)
}
func (a *App) loginUser(w http.ResponseWriter, r *http.Request) {
	controllers.LoginUser(a.DB, w, r)
}
func (a *App) registerUser(w http.ResponseWriter, r *http.Request) {
	controllers.RegisterUser(a.DB, w, r)
}
