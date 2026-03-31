include .env
export

run:
	go run ./cmd/api

migrate-up:
	migrate -path ./migrations -database "$(DATABASE_URL)" up

migrate-down:
	migrate -path ./migrations -database "$(DATABASE_URL)" down

docker-up:
	docker-compose -f docker/docker-compose.yml up -d

docker-up-build:
	docker-compose -f docker/docker-compose.yml up -d --build

docker-down:
	docker-compose -f docker/docker-compose.yml down

swag:
	swag init -g cmd/api/main.go -o docs

test:
	go test ./... -v -cover

lint:
	golangci-lint run

tidy:
	go mod tidy

.PHONY: run migrate-up migrate-down docker-up docker-up-build docker-down swag test lint tidy
