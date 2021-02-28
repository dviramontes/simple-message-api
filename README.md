# `simple-message-api`

> simple message API project

### Project Layout

```
{root}

...
```

- [For API service endpoints refer to this doc](./API.md)

### Requirements

- [Node >= 12](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/get-docker/)
- [NVM](https://github.com/nvm-sh/nvm)

### Setup

- nvm use
- npm i

### Development

- `make dcu`
- `make start`

Other dev tasks

#### Testing

- `npm test`

#### Formatting

- `npm run format` uses prettier

#### Linting

- `npm run format` uses eslint

### Database Change Management

Create new migration

- `npx knex migrate:make <migration_name> -x ts`

Running migrations

- `npx knex migrate:latest --env <env>` where _env_ can be development, staging or production
- `npx knex migrate:rollback` rollback latest
- `npx knex migrate:list` list pending migrations
- For a list of all commands available from knex checkout [this page](https://knexjs.org/#Migrations)
