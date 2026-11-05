package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"sezzle-calculator/backend/internal/httpapi"
)

func main() {
	origin := os.Getenv("ALLOWED_ORIGIN")
	if origin == "" {
		origin = "http://localhost:5173"
	}
	server := &http.Server{
		Addr: ":8080", Handler: httpapi.NewHandler(origin),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second, WriteTimeout: 10 * time.Second,
		IdleTimeout: 60 * time.Second,
	}
	log.Printf("Calculator API listening on %s", server.Addr)
	log.Fatal(server.ListenAndServe())
}
