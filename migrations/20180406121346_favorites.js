
exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorites', function(table) {
    table.increments()
    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .index()
    table.integer('book_id')
      .notNullable()
      .references('id')
      .inTable('books')
      .onDelete('CASCADE')
      .index()
    table.dateTime('created_at').notNullable().defaultTo(knex.raw('now()'))
    table.dateTime('updated_at').notNullable().defaultTo(knex.raw('now()'))
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('favorites')
}
