import * as Knex from "knex";
import { TableBuilder } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table: TableBuilder) => {
    table.increments("id");
    table.string("uuid").unique().notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
}
