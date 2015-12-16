'use strict'

var User = require('../../models/user')

module.exports = function seedUsers(users, callback) {
  User.create(users, callback)
}