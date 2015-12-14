var express = require('express');
var router = express.Router();

var VerificationToken = require('../models/verificationToken')

var passport = require('../config/passport')

var ifGuest = require('./policies/ifGuest')
var ifUser = require('./policies/ifUser')

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
})

router.get('/settings', ifUser, function (req, res, next) {
  res.render('users/settings')
})

router.get('/login', ifGuest, function (req, res, next) {
  res.render('users/login')
})

router.get('/register', ifGuest, function (req, res, next) {
  res.render('users/register')
})

router.get('/confirm/:token', function (req, res, next) {
  var token = req.params.token

  VerificationToken
  .findOne({token})
  .populate('user')
  .exec((err, verificationToken) => {
    if (err) return next(err)
    if (!verificationToken) return res.render('users/confirm/failure')

    var user = verificationToken.user
    user.emailConfirmed = true
    user.save(err => {
      if (err) return next(err)
      
      res.render('users/confirm/success')
    })
  })
})

router.post('/auth/local', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
      if (err) return next(err)
      if (!user) return res.status(400).json({error: 'Invalid username or password'})
      req.logIn(user, (err) => {
        if (err) return next(err)
        res.json({user})
      })
    })(req, res, next)
})

module.exports = router;
