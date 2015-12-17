'use strict'

var express = require('express');
var router = express.Router();
var passport = require('../config/passport')

// Models
var VerificationToken = require('../models/verificationToken')
var User = require('../models/user')


// Policies
var ifGuest = require('./policies/ifGuest')
var ifUser = require('./policies/ifUser')

router.get('/signin', ifGuest, function (req, res, next) {
  res.render('auth/signin')
})

router.get('/signup', ifGuest, function (req, res, next) {
  res.render('auth/signup')
})

router.get('/signup/success', ifGuest, function (req, res, next) {
  res.render('auth/confirm/checkEmail')
})

router.get('/confirm/:token', function (req, res, next) {
  var token = req.params.token

  VerificationToken.verifyUser(token, (err) => {
    if (err) return res.render('auth/confirm/failure')
    res.render('auth/confirm/success')
  })
})

router.post('/signup', ifGuest, function (req, res, next) {
  User
  .findOne({username: req.body.username})
  .exec((err, user) => {
    if (err) return next(err)
    if (user) return res.status(400).json({error: 'A user with that username already exists'})
    if (req.body.password !== req.body.passwordConfirm) return res.status(400).json({error: 'Passwords do not match'})

    user = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    })

    user.save((err, user) => {
      if (err) return next(err)
      res.json({user})
    })
  })
})

router.post('/signin', ifGuest, function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err) }
    if (!user) { return res.status(400).json({error: 'Invalid username or password'}) }
    req.logIn(user, (err) => {
      if (err) { return next(err) }
      res.json({user})
    })
  })(req, res, next)
})

router.post('/logout', ifUser, function (req, res, next) {
  req.logout()
  res.json({message: 'Session destroyed'})
})
module.exports = router
