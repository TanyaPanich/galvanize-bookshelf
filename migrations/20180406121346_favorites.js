
exports.up = (knex, Promise) => {
  return knex.schema.createTable('favorites', (table) => {
    table.integer('user_id')
    .references('users.id')
    .onDelete('CASCADE')
    .notNullable()
    .index()
    table.increments()
    table.integer('book_id')
    .references('books.id')
    .onDelete('CASCADE')
    .notNullable()
    .index()  
    table.dateTime('created_at').notNullable().defaultTo(knex.raw('now()'))
    table.dateTime('updated_at').notNullable().defaultTo(knex.raw('now()'))
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('favorites')
}
