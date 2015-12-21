'use strict'

var _ = require('lodash')
var faker = require('faker')
var User = require('../../models/user')

// Settings
const DEFAULT_PASSWORD = 'pass'
const admin = {
  username: 'admin',
  password: 'pass',
  isAdmin: true
}

module.exports = function seedUsers (usersCount) {
  return (callback) => {
    var users = _.times(usersCount, getFakeUser).concat([admin])
    User.create(users, callback)
  }
}

function getFakeUser (n) {
  return {
    username: faker.internet.userName(),
    // email: faker.internet.email(),
    password: DEFAULT_PASSWORD
  }
}
