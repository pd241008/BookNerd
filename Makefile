# Variables
BACKEND_DIR = backend
FRONTEND_DIR = frontend
SCALA_DIR = biblio-source-engine

.PHONY: help fe be scala dev

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

fe: ## Run the frontend dev server
	cd $(FRONTEND_DIR) && npm run dev

be: ## Run the Go backend
	cd $(BACKEND_DIR) && go run cmd/api/main.go

scala: ## Run the Scala source aggregator
	cd $(SCALA_DIR) && sbt run

dev: ## Run frontend + Go backend together
	npx concurrently "make be" "make fe"

dev-all: ## Run frontend + Go backend + Scala backend
	npx concurrently "make be" "make fe" "make scala"