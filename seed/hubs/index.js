'use strict'


var Hub = require('../../models/hub')
var async = require('async')
var faker = require('faker')

module.exports = function seedHubs(users, callback) {
  var tasks = users.map(createHubsForUser)
  async.parallel(tasks, (err, hubsPerUser) => {
    var allHubs = hubsPerUser.reduce((a, b) => a.concat(b))
    callback(err, allHubs)
  })
}

function createHubsForUser(user) {

  var hubs = [1,2,3].map(index => getFakeHubForUser(user))

  return function(callback) {
    Hub.create(hubs, callback)
  }
}

function getFakeHubForUser(user) {
  return {
    creator: user._id,
    title: faker.name.title(),
    description: faker.lorem.sentence()
  }
}