package upload

import (
    "fmt"
    "io"
    "log"
    "net/http"
    "os"
)

func UploadFile(w http.ResponseWriter, r *http.Request) {
    fmt.Println("File Upload Endpoint Hit")

 
    r.ParseMultipartForm(10 << 20)
   
    file, handler, err := r.FormFile("myFile")
    if err != nil {
        fmt.Println("Error Retrieving the File")
        fmt.Println(err)
        return
    }
    defer file.Close()
    fmt.Printf("Uploaded File: %+v\n", handler.Filename)
    fmt.Printf("File Size: %+v\n", handler.Size)
    fmt.Printf("MIME Header: %+v\n", handler.Header)

  
    tempFile, err := os.CreateTemp("temp-images", "upload-*.pdf")
    if err != nil {
        log.Fatalf("Error creating temp file: %v", err)
    }
    defer tempFile.Close()


    fileBytes, err := io.ReadAll(file)
    if err != nil {
        log.Fatalf("Error reading file: %v", err)
    }

    _, err = tempFile.Write(fileBytes)
    if err != nil {
        log.Fatalf("Error writing to temp file: %v", err)
    }

    fmt.Fprintf(w, "Successfully Uploaded File\n")
}

