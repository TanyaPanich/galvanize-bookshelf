'use strict'

const express = require('express')
const knex = require('../knex')
const { camelizeKeys, decamelizeKeys } = require('humps')
const boom = require('boom')
// eslint-disable-next-line new-cap
const router = express.Router()

// YOUR CODE HERE
router.get('/', (req, res, next) => {
  knex('books')
  .orderBy('title')
  .then((books) => {
      const camelBooks = camelizeKeys(books)
      res.status(200).send(camelBooks)
  })
  .catch((err) => {
      next(err)
  })
})

router.get('/:id', (req, res, next) => {
  const { id } = req.params
  if(isNaN(id)) next(boom.notFound())
  knex('books')
    .where('id', id)
    .then(book => {
      if(book.length <= 0) {
        next(boom.notFound())
      } else {
        const camelBook = camelizeKeys(book[0])
        res.status(200).send(camelBook)
      }
    })
    .catch((err) => {
      next(err)
    })
})

router.post('/', (req, res, next) => {
  const body = req.body
  const newBook = {
    title: body.title,
    author: body.author,
    genre: body.genre,
    description: body.description,
    cover_url: body.coverUrl
  }
  const errors = {
    title: boom.badRequest('Title must not be blank'),
    author: boom.badRequest('Author must not be blank'),
    genre:  boom.badRequest('Genre must not be blank'),
    description: boom.badRequest('Description must not be blank'),
    cover_url: boom.badRequest('Cover URL must not be blank')
  }
  for (let key in newBook) {
    if (!newBook[key]) {
      next(errors[key])
    }
  }
  knex('books')
    .insert(decamelizeKeys(newBook), '*')
    .then(data => {
      res.status(200).send(camelizeKeys(data[0]))
    })
    .catch(err => {
      next(err)
    })
})

router.patch('/:id', (req, res, next) => {
  const { id } = req.params
  if(isNaN(id)) next(boom.notFound())
  const updatedBook = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.coverUrl
  }
  knex('books')
  .where('id', id)
  .then(book => {
    if(book.length <= 0) next(boom.notFound())
    knex('books')
      .where('id', id)
      .limit(1)
      .update(updatedBook)
      .returning('*')
      .then(data => {
        res.status(200).send(camelizeKeys(data[0]))
      })
      .catch(err => {
        next(boom.notFound())
      })
    })
  .catch(err => {
    next(boom.notFound())
  })
})


router.delete('/:id', (req, res, next) => {
  if(isNaN(req.params.id)) next(boom.notFound())
  knex('books')
  .where('id', req.params.id)
  //if we use AS here --> 'cover_url AS coverUrl', we do not need humps
  .first(['title', 'author', 'genre', 'description', 'cover_url'])
  //.first()
    .then(book => {
      if(!book) return next(boom.notFound())
      const deletedBook = camelizeKeys(book)
      knex('books')
        .del()
        .where('id', req.params.id)
        .then(() => {
            //delete deletedBook.created_at
            //delete deletedBook.updated_at
            //delete deletedBook.id
            res.status(200).send(deletedBook)
        })

    })
    .catch(err => {
      next(err)
    })
})

module.exports = router
