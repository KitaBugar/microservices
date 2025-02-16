package server

import (
	"fmt"
	"log"
	"net/http"
	"server/config"
	"server/middleware"

	"server/pkg/models"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type App struct {
	Router   *mux.Router
	DB       *gorm.DB
	validate *validator.Validate
}

func (a *App) Initialize(config *config.Config) {

	var err error

	dbUri := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		config.DB.User,
		config.DB.Password,
		config.DB.Host,
		config.DB.Port,
		config.DB.DBName,
	)

	a.DB, err = gorm.Open(mysql.Open(dbUri), &gorm.Config{})

	if err != nil {
		log.Fatal("Tdak terkoneksi ke database")
	}
	sqlDB, err := a.DB.DB()
	if err != nil {
		log.Fatal("Filed connection DB :", err)
	}

	err = sqlDB.Ping()
	if err != nil {
		panic(err)
	}

	fmt.Println("Successfully connected!")
	a.Router = mux.NewRouter()

	fs := http.FileServer(http.Dir("./public"))
	a.Router.PathPrefix("/assets/").Handler(http.StripPrefix("/assets/", fs))
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"OPTIONS", "GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Authorization"},
		AllowCredentials: true,
	})
	a.Router.Use(c.Handler)
	a.setRouters()
	a.DB.AutoMigrate(&models.User{},
		&models.Gym{},
		&models.Facility{},
		&models.Membership{},
		&models.Claims{},
		&models.MembershipOption{},
		&models.Transaction{},
		&models.Method{},
		&models.MethodPayment{},
		&models.CheckIn{},
	)
}

func (a *App) setRouters() {
	apiRouter := a.Router.PathPrefix("/api").Subrouter()
	apiRouter.Use(middleware.Authorization)

	apiRouter.HandleFunc("/{any:.*}", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}).Methods("OPTIONS")

	// Authentication
	apiRouterMiddle := a.Router.PathPrefix("/api").Subrouter()
	a.Post(apiRouterMiddle, "/user/login", a.loginUser)
	a.Post(apiRouterMiddle, "/user/register", a.registerUser)

	// User
	a.Get(apiRouter, "/user", a.getUser)
	a.Post(apiRouter, "/user", a.createUser)
	a.Update(apiRouter, "/user", a.updateUser)
	a.Get(apiRouter, "/user/detail", a.detailUser)
	a.Delete(apiRouter, "/user", a.deleteUser)
	a.Post(apiRouter, "/user/ktp", a.uploadKTP)

	// Confirmation KTP
	a.Get(apiRouter, "/user/ktp/confirmation", a.getAllKtp)
	a.Update(apiRouter, "/user/ktp/confirmation", a.updateConfirmKtp)

	// Gym
	a.Get(apiRouter, "/gym/owner", a.getAllGymOwner)

	// Gym
	a.Get(apiRouter, "/gym", a.getAllGym)
	a.Post(apiRouter, "/gym", a.createGym)
	a.Update(apiRouter, "/gym/{gymID}", a.updateGym)
	a.Get(apiRouter, "/gym/{gymID}", a.detailGym)
	a.Delete(apiRouter, "/gym/{gymID}", a.deleteGym)

	// Membership Options
	a.Get(apiRouter, "/membership-option", a.getAllMembershipOptions)
	a.Post(apiRouter, "/membership-option/{gymID}", a.createMembershipOptions)
	a.Update(apiRouter, "/membership-option", a.updateGym)
	a.Delete(apiRouter, "/membership-option", a.deleteGym)

	// Membership
	a.Get(apiRouter, "/membership", a.listMembership)
	a.Post(apiRouter, "/membership", a.buyMembership)
	a.Update(apiRouter, "/membership", a.updateGym)
	a.Delete(apiRouter, "/membership", a.deleteGym)

	a.Get(apiRouter, "/membership/{gymID}/check", a.getCheckInGym)
	a.Post(apiRouter, "/membership/{gymID}/check", a.createCheckInGym)

	// Location
	a.Get(apiRouter, "/province", a.getAllProvince)
	a.Get(apiRouter, "/province/{provinceID}", a.provinceById)
	a.Get(apiRouter, "/regency", a.getAllRegency)
	a.Get(apiRouter, "/regency/{regencyID}", a.regencyById)

	// Facility
	a.Get(apiRouter, "/facility", a.getAllFacility)
	a.Post(apiRouter, "/facility", a.createFacility)
	a.Update(apiRouter, "/facility", a.updateFacility)

	// Method
	a.Get(apiRouter, "/method", a.getAllMethod)
	a.Post(apiRouter, "/method", a.createMethod)
	a.Update(apiRouter, "/method", a.updateMethod)

	// Method Payment
	a.Get(apiRouter, "/method-payment", a.getMethodPayment)
	a.Post(apiRouter, "/method-payment", a.createMethodPayment)
	a.Update(apiRouter, "/method-payment", a.updateMethodPayment)

	// Transaction Membership
	a.Get(apiRouter, "/transaction", a.getAllTransaction)
	a.Update(apiRouter, "/transaction", a.handleTransaction)

}

func (a *App) Get(apiRouter *mux.Router, path string, f func(w http.ResponseWriter, r *http.Request)) {
	apiRouter.HandleFunc(path, f).Methods("GET")
}
func (a *App) Post(apiRouter *mux.Router, path string, f func(w http.ResponseWriter, r *http.Request)) {
	apiRouter.HandleFunc(path, f).Methods("POST")
}
func (a *App) Update(apiRouter *mux.Router, path string, f func(w http.ResponseWriter, r *http.Request)) {
	apiRouter.HandleFunc(path, f).Methods("PUT")
}
func (a *App) Delete(apiRouter *mux.Router, path string, f func(w http.ResponseWriter, r *http.Request)) {
	apiRouter.HandleFunc(path, f).Methods("DELETE")
}

func (a *App) Run(host string) {
	log.Fatal(http.ListenAndServe(host, a.Router))
}
