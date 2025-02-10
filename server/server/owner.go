package server

import (
	"net/http"
	"server/controllers"
)

func (a *App) GetAllGymOwner(w http.ResponseWriter, r *http.Request) {
	controllers.GetAllGymOwner(a.DB, w, r)
}
