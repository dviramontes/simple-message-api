module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: "messages",
      user: "postgres",
      password: "postgres",
      servername: "localhost",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
  test: {
    client: "postgresql",
    connection: {
      database: "messages-test",
      user: "postgres",
      password: "postgres",
      servername: "localhost",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
  production: {},
};
