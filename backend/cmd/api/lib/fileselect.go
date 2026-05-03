package lib

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
)

// Book represents the metadata for a file in our storage
type Book struct {
	Name string `json:"name"`
	Path string `json:"path"`
	Size int64  `json:"size"`
}

// ListBooks parses the data directory and returns a list of available files
func ListBooks(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Listing available books...")

	// Use "data" since the server usually runs from the backend root
	dataDir := "data"
	
	// Ensure directory exists
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

// GetBook serves a specific book file based on the 'name' query parameter
func GetBook(w http.ResponseWriter, r *http.Request) {
	fileName := r.URL.Query().Get("name")
	if fileName == "" {
		http.Error(w, "Missing 'name' parameter", http.StatusBadRequest)
		return
	}

	// Safety check: Clean the path to prevent directory traversal (e.g. ../../etc/passwd)
	finalPath := filepath.Join("data", filepath.Base(fileName))

	if _, err := os.Stat(finalPath); os.IsNotExist(err) {
		http.Error(w, "Book not found", http.StatusNotFound)
		return
	}

	// Set PDF content type (you can expand this for epub later)
	w.Header().Set("Content-Type", "application/pdf")
	http.ServeFile(w, r, finalPath)
}
