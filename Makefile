.PHONY: dcu dcd start build dev format lint

dcu:
	docker-compose up -d
	docker-compose logs -f

dcd:
	docker-compose down

start:
	npm run dev

build:
	npm run build

dev:
	npm run dev

format:
	npm run format

lint:
	npm run lint
