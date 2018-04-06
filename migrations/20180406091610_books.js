exports.up = function(knex, Promise) {
  return knex.schema.createTable('books', (table) => {
    table.increments()
    table.varchar('title', 255).defaultTo('').notNullable()
    table.varchar('author', 255).defaultTo('').notNullable()
    table.varchar('genre', 255).defaultTo('').notNullable()
    table.text('description').defaultTo('').notNullable()
    table.text('cover_url').defaultTo('').notNullable()
  // table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    //table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
    //table.timestamps(true, true)
    table.dateTime('created_at').notNullable().defaultTo(knex.raw('now()'))
    table.dateTime('updated_at').notNullable().defaultTo(knex.raw('now()'))
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('books')
}
