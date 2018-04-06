
exports.up = (knex, Promise) => {
  return knex.schema.createTable('favorites', (table) => {
    table.increments()
    table.integer('book_id')
    .notNullable()
    .references('id')
    .inTable('books')
    .onDelete('cascade')
    .index()
    table.integer('user_id')
    .notNullable()
    .references('id')
    .inTable('users')
    .onDelete('cascade')
    .index()
    table.dateTime('created_at').notNullable().defaultTo(knex.raw('now()'))
    table.dateTime('updated_at').notNullable().defaultTo(knex.raw('now()'))
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('favorites')
}
