'use strict'

var User = require('../../models/user')
var users = require('./data')
var faker = require('faker')

const fakeUsersCount = 100

module.exports = function seedUsers(callback) {

  // Generate random fakeUsersCount users
  for (let i = 0; i < fakeUsersCount; i++) users.push(getFakeUser())
  
  User.create(users, callback)
}

function getFakeUser () {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: '12345678'
  }
}