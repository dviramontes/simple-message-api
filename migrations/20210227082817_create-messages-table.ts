import * as Knex from "knex";
import { TableBuilder } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("messages", (table: TableBuilder) => {
    table.increments("id").notNullable().primary();
    table.text("content");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.timestamp("deleted_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("messages");
}