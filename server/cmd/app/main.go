package main

import (
	"log"
	"server/config"
	"server/server"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file", err)
	}
	Config := config.GetConfig()
	App := &server.App{}
	App.Initialize(Config)
	App.Run(":8000")
}
