package storage

import (
	"context"
	"errors"
	"io"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func saveToS3(ctx context.Context, filename string, file io.Reader, size int64) (*FileMetadata, error) {
	bucket := os.Getenv("AWS_S3_BUCKET")
	region := os.Getenv("AWS_REGION")

	if bucket == "" || region == "" {
		return nil, errors.New("AWS_S3_BUCKET and AWS_REGION must be set when USE_S3 is true")
	}

	cfg, err := config.LoadDefaultConfig(ctx, config.WithRegion(region))
	if err != nil {
		return nil, err
	}

	client := s3.NewFromConfig(cfg)
	uploader := manager.NewUploader(client)

	s3Key := "uploads/" + filename

	_, err = uploader.Upload(ctx, &s3.PutObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(s3Key),
		Body:   file,
	})
	if err != nil {
		return nil, err
	}

	return &FileMetadata{
		Name: filename,
		Path: s3Key,
		Size: size,
	}, nil
}
