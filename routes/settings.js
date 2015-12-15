'use strict'

var express = require('express');
var router = express.Router();
var passport = require('../config/passport')

// Models
var User = require('../models/user')

// Policies
var ifUser = require('./policies/ifUser')

// GET /settings
router.get('/', ifUser, function (req, res, next) {
  res.render('settings/index')
})

router.post('/', ifUser, function (req, res, next) {
  var user = req.user
  
  user.comparePassword(req.body.password, (err, isValid) => {
  
    if (err) return next(err)
    if (!isValid) return res.status(400).json({error: 'Current password is incorrect'})

    user.username = req.body.username
    user.email = req.body.email
    if (req.body.newPassword) user.password = req.body.newPassword
  
    user.save((err, user) => {
  
      if (err) return next(err)
      res.json({user})
    })
  })
})

module.exports = router
