'use strict'

var async = require('async')
var colors = require('colors')
var mongoose = require('../config/mongoose')

var articles = require('./articles')
var hubs = require('./hubs')
var users = require('./users')
var comments = require('./comments')
var reporter = require('./reporter')

mongoose.connection.once('open', function () {
  console.log(colors.red('Mongo connection opened'))
  mongoose.connection.db.dropDatabase(function () {
    console.log(colors.red('\nDatabase dropped!'))
    async.series({users, hubs, articles, comments}, reporter)
  })
})
