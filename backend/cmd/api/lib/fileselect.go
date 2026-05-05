package lib

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
)

type Book struct {
	Name string `json:"name"`
	Path string `json:"path"`
	Size int64  `json:"size"`
}

func ListBooks(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Listing available books...")

	dataDir := "data"

	if _, err := os.Stat(dataDir); os.IsNotExist(err) {
		os.Mkdir(dataDir, 0755)
	}

	files, err := os.ReadDir(dataDir)
	if err != nil {
		http.Error(w, "Could not read data directory", http.StatusInternalServerError)
		return
	}

	var books []Book
	for _, f := range files {
		if !f.IsDir() {
			info, err := f.Info()
			if err != nil {
				continue
			}
			books = append(books, Book{
				Name: f.Name(),
				Path: filepath.Join(dataDir, f.Name()),
				Size: info.Size(),
			})
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(books)
}

func GetBook(w http.ResponseWriter, r *http.Request) {
	fileName := r.URL.Query().Get("name")
	if fileName == "" {
		http.Error(w, "Missing 'name' parameter", http.StatusBadRequest)
		return
	}

	finalPath := filepath.Join("data", filepath.Base(fileName))

	if _, err := os.Stat(finalPath); os.IsNotExist(err) {
		http.Error(w, "Book not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/pdf")
	http.ServeFile(w, r, finalPath)
}
