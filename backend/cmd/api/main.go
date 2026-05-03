package main

import (
	"book-reading-backend/cmd/api/lib"
	"book-reading-backend/cmd/api/upload"
	"fmt"
	"log"
	"net/http"
)

func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			return
		}

		next(w, r)
	}
}

func main() {
	fmt.Println("Aegis Reader API starting on Port 8080")

	http.HandleFunc("/upload", enableCORS(upload.UploadFile))
	http.HandleFunc("/books", enableCORS(lib.ListBooks))
	http.HandleFunc("/book", enableCORS(lib.GetBook))
	http.HandleFunc("/health", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "OK")
	}))
	http.HandleFunc("/", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello This is the Starting Point of the API")
	}))

	log.Fatal(http.ListenAndServe(":8080", nil))
}
