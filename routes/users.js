'use strict';

const express = require('express');
const knex = require('../knex')
const { camelizeKeys, decamelizeKeys } = require('humps')
const bcrypt = require('bcrypt');
const boom = require('boom')
const jwt = require('jsonwebtoken')


// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
router.post('/', (req,res,next) => {
  if(!req.body.email) next(boom.badRequest('Email must not be blank'))
  isEmailExist(req.body.email, next)
  if(!req.body.password || req.body.password.length < 8)
    next(boom.badRequest('Password must be at least 8 characters long'))

  bcrypt.hash(req.body.password, 12)
    .then(hash => {
      return knex('users')
      .insert({
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        hashed_password: hash
      }, '*')
    })
      //.returning('*')
    .then(user => {
      const token = jwt.sign({'email': req.body.email }, process.env.JWT_KEY)
      const newUser ={
        id: user[0].id,
        firstName: user[0].first_name,
        lastName: user[0].last_name,
        email: user[0].email
    }
    res.setHeader('Set-Cookie', `token=${token}; Path=\/;.+HttpOnly`)
    res.status(200).send(newUser)
  })
  .catch(err => {
      next(err)
  })
})

function isEmailExist(email, next) {
  knex('users')
  .then(data => {
    for(let user of data) {
      if(user.email === email) {
        return next(boom.badRequest('Email already exists'))
      }
    }
  })
}
module.exports = router
