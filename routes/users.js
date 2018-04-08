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
  //CHECK FOR ERRORS
  if(!req.body.email) next(boom.badRequest('Email must not be blank'))
  isEmailExist(req.body.email, next)
  if(!req.body.password || req.body.password.length < 8)
    next(boom.badRequest('Password must be at least 8 characters long'))

  knex('users')
    .returning(['id','first_name','last_name', 'email'])
    .insert({
        'first_name': req.body.firstName,
        'last_name': req.body.lastName,
        'email': req.body.email,
        'hashed_password': bcrypt.hashSync(req.body.password,8)
    }).then((user) => {
      const token = jwt.sign({'email': req.body.email }, process.env.JWT_KEY)
      res.setHeader('Set-Cookie', `token=${token}; Path=\/;.+HttpOnly`)
      res.send(camelizeKeys(user[0]));
    }).catch(err => {
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
