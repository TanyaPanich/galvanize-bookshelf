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

module.exports = router;
