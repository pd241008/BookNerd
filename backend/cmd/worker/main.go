package main

import (
	"fmt"
	"time"
)

func main() {
	fmt.Println("Biblio Reader Worker starting...")
	
	for {
		fmt.Println("Processing background tasks...")
		time.Sleep(10 * time.Second)
	}
}
