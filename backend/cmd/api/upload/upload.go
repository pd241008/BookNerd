package upload

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func UploadFile(w http.ResponseWriter, r *http.Request) {
	fmt.Println("File Upload Endpoint Hit")

	// Max upload size: 10 MB
	r.ParseMultipartForm(10 << 20)

	file, handler, err := r.FormFile("myFile")
	if err != nil {
		fmt.Println("Error Retrieving the File")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()
	fmt.Printf("Uploaded File: %+v\n", handler.Filename)
	fmt.Printf("File Size: %+v\n", handler.Size)
	fmt.Printf("MIME Header: %+v\n", handler.Header)



	// 2. Extract and normalize the extension
	ext := strings.ToLower(filepath.Ext(handler.Filename))

	if ext != ".pdf" && ext != ".docx" {

		fmt.Printf("Uploaded File Has Invalid Format: %s\n", ext)

		http.Error(w, "Invalid file format. Only PDF and DOCX are allowed.", http.StatusUnsupportedMediaType)
		return
	}

	fmt.Printf("File %s extension is valid!\n", handler.Filename)

	dataDir := "data"
	if _, err := os.Stat(dataDir); os.IsNotExist(err) {
		os.Mkdir(dataDir, 0755)
	}

	dstPath := filepath.Join(dataDir, handler.Filename)
	dst, err := os.Create(dstPath)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"message": "Successfully Uploaded File", "filename": "%s", "id": "%d"}`, handler.Filename, handler.Size)
}
