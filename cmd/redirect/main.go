// Package main provides the entry point for the klaudiu.sh redirect service.
package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/smykla-labs/klaudiu.sh/internal/redirect"
)

const (
	readTimeout  = 5 * time.Second
	writeTimeout = 10 * time.Second
	idleTimeout  = 120 * time.Second
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/", redirect.Handler)

	server := &http.Server{
		Addr:         ":" + port,
		Handler:      mux,
		ReadTimeout:  readTimeout,
		WriteTimeout: writeTimeout,
		IdleTimeout:  idleTimeout,
	}

	log.Printf("Starting server on :%s", port)

	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
