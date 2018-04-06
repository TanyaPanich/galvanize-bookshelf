
'use strict'

const express = require('express')
const jwt = require('jsonwebtoken')
const boom = require('boom')
const knex = require('../knex')
const bcrypt = require('bcrypt')

// eslint-disable-next-line new-cap
const router = express.Router()

// YOUR CODE HERE
router.get('/', (req, res, next) => {
  if(!req.cookies.token) {
    console.log('no token')
    res.status(200).json(false)
    return
  }
 jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, _payload) => {
   if (err) {
     return res.json(false);
   }
   res.json(true);
 })
})

router.post('/', (req, res, next) => {
  if(!req.body.email || !req.body.email.trim())
    next(boom.badRequest('Email must not be blank'))
  if(!req.body.password || !req.body.password.trim())
    next(boom.badRequest('Password must not be blank'))
  if(req.body.password.length < 8)
    next(boom.badRequest('Bad email or password'))

  knex('users')
    .where('email', req.body.email)
    .first()
    .then(userData => {
      if(!userData) {
        next(boom.badRequest('Bad email or password'))
      } else {
        //verify password with db password
        bcrypt.compare(req.body.password, userData.hashed_password, (err, result) => {
          if (err) {
            console.log('err', err);
            return
          }
          if(!result) {
            next(boom.badRequest('Bad email or password'))
          } else {
            //create and sign token - it will be used in future communication
            //between browser and server
            const token = jwt.sign({'email': req.body.email }, process.env.JWT_KEY)
            res.setHeader('Set-Cookie', `token=${token}; Path=\/;.+HttpOnly`)
            const userResult = {
              id: userData.id,
              firstName: userData.first_name,
              lastName: userData.last_name,
              email: userData.email
            }
            res.status(200).json(userResult)
          }
        })
      }
    })
    .catch(err => {
      next(err)
    })
})

router.delete('/', (req, res, next) => {
 res.setHeader('Set-Cookie', `token=; Path=\/;.+HttpOnly`)
 res.status(200).send(true)
})

module.exports = router
