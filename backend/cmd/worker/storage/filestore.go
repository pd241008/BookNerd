package storage

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
)

type BookStore struct {
	Name string `json:"name"`
	Path string `json:"path"`
	Size int64  `json:"size"`
}

func CheckEnv() {
}

// FileStorageMethod handles uploading a local file to S3 and returns the file metadata
func FileStorageMethod(w http.ResponseWriter, r *http.Request) {
	// 1. Read configuration from environment variables
	bucket := os.Getenv("AWS_S3_BUCKET")
	region := os.Getenv("AWS_REGION")
	filename := os.Getenv("LOCAL_FILE_PATH") // Or parse this dynamically from r.Body/r.Form
	s3Key := os.Getenv("AWS_S3_KEY")

	if bucket == "" || region == "" || filename == "" || s3Key == "" {
		http.Error(w, "Missing required environment configuration", http.StatusInternalServerError)
		return
	}

	// 2. Load AWS credentials and config
	cfg, err := config.LoadDefaultConfig(r.Context(), config.WithRegion(region))
	if err != nil {
		http.Error(w, "Failed to load AWS config", http.StatusInternalServerError)
		return
	}

	// 3. Open the file to get size and data stream
	file, err := os.Open(filename)
	if err != nil {
		http.Error(w, "Failed to open local file", http.StatusInternalServerError)
		return
	}
	defer file.Close()

	fileInfo, err := file.Stat()
	if err != nil {
		http.Error(w, "Failed to read file metadata", http.StatusInternalServerError)
		return
	}

	// 4. Initialize S3 Uploader and upload
	client := s3.NewFromConfig(cfg)
	uploader := manager.NewUploader(client)

	_, err = uploader.Upload(r.Context(), &s3.PutObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(s3Key),
		Body:   file,
	})
	if err != nil {
		http.Error(w, "Failed to upload file to S3", http.StatusInternalServerError)
		return
	}

	// 5. Populate your BookStore struct
	response := BookStore{
		Name: fileInfo.Name(),
		Path: s3Key,
		Size: fileInfo.Size(),
	}

	// 6. Return JSON response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("failed to write JSON response: %v", err)
	}
}
