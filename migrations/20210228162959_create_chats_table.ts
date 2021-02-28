import * as Knex from "knex";
import { TableBuilder } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("chats", (table: TableBuilder) => {
    table.increments("id");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("chats");
}
