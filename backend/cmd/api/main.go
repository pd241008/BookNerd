package main

import (
	"fmt"
	"log"
	"net/http"
	"book-reading-backend/cmd/api/upload"
)

func main() {
	fmt.Println("Aegis Reader API starting on Port 8080")
	
	http.HandleFunc("/upload", upload.UploadFile)
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "OK")
	})
    http.HandleFunc("/",func(w http.ResponseWriter,r *http.Request) {
		fmt.Fprintf(w,"Hello This is the Starting Point of the API")
	})
	log.Fatal(http.ListenAndServe(":8080", nil))
}
