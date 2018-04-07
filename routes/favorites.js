'use strict';
const express = require('express')
const knex = require('../knex')
const jwt = require('jsonwebtoken')
const { camelizeKeys, decamelizeKeys } = require('humps')
const boom = require('boom')
// eslint-disable-next-line new-cap
const router = express.Router();

function verifyToken(req, res, next) {
  if(!req.cookies.token) {
    return next(boom.unauthorized())
  }
  const token = req.cookies.token
  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return next(boom.unauthorized())
    }
  req.token = decoded
  next()
})
}

// YOUR CODE HERE
router.get('/', verifyToken, (req, res, next) => {
  knex('favorites')
    .select('favorites.id AS id',
            'favorites.book_id AS bookId',
            'favorites.user_id AS userId',
            'books.created_at AS createdAt',
            'books.updated_at AS updatedAt',
            'books.title AS title',
            'books.author AS author',
            'books.genre AS genre',
            'books.description AS description',
            'books.cover_url AS coverUrl')
    .innerJoin('books', 'books.id', 'favorites.book_id')
    .innerJoin('users', 'favorites.user_id', 'users.id')
    .where('users.email', req.token.email)
    //.retruning('id', 'favorites.book_id AS bookID', 'favorites.user_id AS userId', 'created_at AS createdAt', 'updated_at AS updatedAt', 'title', 'author', 'genre', 'description', 'cover_url AS coverUrl')
    .returning('*')
    .then((results) => {
      res.status(200).json(results)
    })
    .catch((err) => {
      next(err)
    })
  })

  router.get('/check', verifyToken, (req, res, next) => {
    const bookId = Number.parseInt(req.query.bookId)
    const userId = req.cookies.token
    if(isNaN(bookId)) next(boom.badRequest('Book ID must be an integer'))
    knex('books')
      .innerJoin('favorites', 'books.id', 'favorites.book_id')
      .innerJoin('users', 'favorites.user_id', 'users.id')
      .where({'favorites.book_id': bookId,
              'users.email': req.token.email})
      .then((result) => {
        if(result.length > 0) {
          return res.json(true)
        }
        return res.json(false)
      })
      .catch((err) => {
        next(err)
      })
  })

  function getUserId(req, res, next){
    const token = req.cookies.token
    if (token) {
      const decoded = jwt.decode(token)
      knex('users')
        .select(['id'])
        .where('email', decoded.email)
        .first()
        .then((userData) => {
          req.userId = userData.id
          next()
        })
        .catch(err => next(err))
    } else {
      next(boom.unauthorized())
    }
  }

  router.post('/', getUserId, (req, res, next) => {
    const bookId = Number.parseInt(req.body.bookId)
    if(isNaN(bookId)) next(boom.badRequest('Book ID must be an integer'))
    knex('favorites')
    .insert([{book_id: bookId,
            user_id: req.userId}])
    .returning(['id', 'book_id', 'user_id'])
    .then((newFav) => {
      res.json(camelizeKeys(newFav[0]))
    })
    .catch(err => {
      next(err)
    })
  })

  router.delete('/', getUserId, (req, res, next) => {
    const bookId = Number.parseInt(req.body.bookId)
    if(isNaN(bookId)) next(boom.badRequest('Book ID must be an integer'))
    const clause = { book_id: bookId, user_id: req.userId }
    knex('favorites')
      .where(clause)
      .del()
      .returning(['book_id', 'user_id'])
      .then((deletedBook) => {
      res.json(camelizeKeys(deletedBook[0]))
    })
    .catch(err => {
      next(err)
    })
  })

module.exports = router;
