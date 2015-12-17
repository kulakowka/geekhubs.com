'use strict'

var express = require('express')
var router = express.Router()

router.get('/', function (req, res, next) {
  if (req.user) return res.redirect('/articles/subscription')
  res.redirect('/articles')
})

module.exports = router
