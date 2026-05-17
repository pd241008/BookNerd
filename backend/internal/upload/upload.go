package upload

import (
	"fmt"
	"net/http"
	"path/filepath"
	"strings"

	"book-reading-backend/internal/storage"
)

func UploadFile(w http.ResponseWriter, r *http.Request) {
	fmt.Println("File Upload Endpoint Hit")

	// Max upload size: 10 MB
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		fmt.Println("Error parsing form:", err)
		http.Error(w, "Failed to parse form", http.StatusBadRequest)
		return
	}

	file, handler, err := r.FormFile("myFile")
	if err != nil {
		fmt.Println("Error Retrieving the File")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer func() {
		_ = file.Close()
	}()
	fmt.Printf("Uploaded File: %+v\n", handler.Filename)
	fmt.Printf("File Size: %+v\n", handler.Size)
	fmt.Printf("MIME Header: %+v\n", handler.Header)

	ext := strings.ToLower(filepath.Ext(handler.Filename))
	if ext != ".pdf" && ext != ".docx" {
		fmt.Printf("Uploaded File Has Invalid Format: %s\n", ext)
		http.Error(w, "Invalid file format. Only PDF and DOCX are allowed.", http.StatusUnsupportedMediaType)
		return
	}

	fmt.Printf("File %s extension is valid!\n", handler.Filename)

	// Delegate saving logic to our master state manager!
	meta, err := storage.SaveFile(r.Context(), handler.Filename, file, handler.Size)
	if err != nil {
		fmt.Println("Error saving file:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"message": "Successfully Uploaded File", "filename": "%s", "size": "%d", "path": "%s"}`, meta.Name, meta.Size, strings.ReplaceAll(meta.Path, "\\", "\\\\"))
}
