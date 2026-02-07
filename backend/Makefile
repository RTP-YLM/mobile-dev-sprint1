.PHONY: install dev build test test-api migrate clean docker-up docker-down help

# Default target
help:
	@echo "Available commands:"
	@echo "  make install    - Install dependencies"
	@echo "  make dev        - Start development server"
	@echo "  make build      - Build TypeScript"
	@echo "  make test       - Run unit tests"
	@echo "  make test-api   - Run API integration tests"
	@echo "  make migrate    - Run database migrations"
	@echo "  make docker-up  - Start PostgreSQL with Docker"
	@echo "  make docker-down - Stop PostgreSQL container"
	@echo "  make clean      - Clean build files"

install:
	npm install

cp-env:
	@if [ ! -f .env ]; then cp .env.example .env; fi

dev: cp-env
	npm run dev

build:
	npm run build

test:
	npm test

test-api:
	npm run test:api

migrate:
	npm run db:migrate

typecheck:
	npm run typecheck

docker-up:
	docker run -d \
		--name auth-postgres \
		-e POSTGRES_USER=postgres \
		-e POSTGRES_PASSWORD=postgres \
		-e POSTGRES_DB=auth_db \
		-p 5432:5432 \
		postgres:15-alpine || echo "Container may already exist"
	@echo "Waiting for PostgreSQL to be ready..."
	@sleep 3

docker-down:
	docker stop auth-postgres || true
	docker rm auth-postgres || true

clean:
	rm -rf dist
	rm -rf coverage
	rm -rf node_modules

setup: install cp-env
	@./setup.sh