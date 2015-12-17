'use strict'

var _ = require('lodash')
var faker = require('faker')
var Hub = require('../../models/hub')
var User = require('../../models/user')

// Settings
const USERS_COUNT = 5
const HUBS_COUNT = 5

module.exports = function seedHubs(callback) {
  User.find().exec(function(err, users) {
    if (err) return callback(err)

    var hubs = _.sample(users, USERS_COUNT).reduce(userHubsReducer, [])

    Hub.create(hubs, callback)
  }) 
}

function userHubsReducer (hubs, user) {
  let userHubs = _.times(HUBS_COUNT, (n) => getFakeHub(user) )
  return hubs.concat(userHubs)
}

function getFakeHub (user) {
  return {
    creator: user._id,
    title: faker.hacker.noun(),
    description: faker.hacker.phrase()
  }
}