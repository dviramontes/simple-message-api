# dev-targets
.PHONY: dcu dcd build dev format lint server migrate
# test targets
.PHONY: test test-dcd test-dcu

dcu:
	docker-compose up -d
	docker-compose logs -f

dcd:
	docker-compose down

server: migrate
	npm start

build:
	npm run build

dev:
	npm run dev

format:
	npm run format

lint:
	npm run lint

test:
	npm run test

test-dcu:
	docker-compose -f ./docker-compose.test.yaml up -d

test-dcd:
	docker-compose -f ./docker-compose.test.yaml down

migrate:
	npx knex migrate:latest --env development


