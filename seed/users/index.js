'use strict'

var User = require('../../models/user')
var async = require('async')

var users = require('./data')

module.exports = function seedUsers(callback) {
  User.create(users, callback)
}