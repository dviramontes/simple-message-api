import * as Knex from "knex";
import { TableBuilder } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user_messages", (table: TableBuilder) => {
    table.increments("id").notNullable().primary();

    table.integer("message_id").unsigned();
    table
      .foreign("message_id")
      .references("messages.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");

    table.integer("user_id").unsigned();
    table
      .foreign("user_id")
      .references("users.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.timestamp("deleted_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("user_messages");
}
