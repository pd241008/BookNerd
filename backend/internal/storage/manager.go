package storage

import (
	"context"
	"io"
	"os"
	"strconv"
)

// FileMetadata holds info about the uploaded file
type FileMetadata struct {
	Name string `json:"name"`
	Path string `json:"path"`
	Size int64  `json:"size"`
}

// SaveFile is the moderator function that checks environment/flags
// and decides whether to save to S3 or locally.
func SaveFile(ctx context.Context, filename string, file io.Reader, size int64) (*FileMetadata, error) {
	// Our "master switch" logic: Check if USE_S3 is set to "true"
	useS3, _ := strconv.ParseBool(os.Getenv("USE_S3"))

	if useS3 {
		return saveToS3(ctx, filename, file, size)
	}

	return saveToLocal(ctx, filename, file, size)
}
