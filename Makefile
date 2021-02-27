.PHONY: dcu dcd start build dev

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
