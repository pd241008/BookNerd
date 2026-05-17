package storage

import (
	"context"
	"io"
	"os"
	"path/filepath"
)

func saveToLocal(ctx context.Context, filename string, file io.Reader, size int64) (*FileMetadata, error) {
	dataDir := "data"

	if _, err := os.Stat(dataDir); os.IsNotExist(err) {
		if err := os.Mkdir(dataDir, 0755); err != nil {
			return nil, err
		}
	}

	dstPath := filepath.Join(dataDir, filename)
	dst, err := os.Create(dstPath)
	if err != nil {
		return nil, err
	}
	defer func() {
		_ = dst.Close()
	}()

	if _, err := io.Copy(dst, file); err != nil {
		return nil, err
	}

	return &FileMetadata{
		Name: filename,
		Path: dstPath,
		Size: size,
	}, nil
}
