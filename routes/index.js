'use strict'

var express = require('express')
var router = express.Router()

router.get('/', function renderIndex (req, res, next) {
  res.render('index')
})

module.exports = router
