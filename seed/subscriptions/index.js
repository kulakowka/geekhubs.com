'use strict'

var _ = require('lodash')
var SubscriptionUserToHub = require('../../models/subscriptionUserToHub')
var async = require('async')
var User = require('../../models/user')
var Hub = require('../../models/hub')

// Settings
const SUBSCRIPTIONS_COUNT = 1000

module.exports = function seedSubscriptions (callback) {
  async.parallel({users: getUsers, hubs: getHubs}, (err, result) => {
    if (err) return callback(err)

    var subscriptions = _.times(SUBSCRIPTIONS_COUNT, (n) => getFakeSubscription(result))

    SubscriptionUserToHub.create(subscriptions, callback)
  })
}

function getHubs (callback) {
  Hub.find().exec(callback)
}

function getUsers (callback) {
  User.find().exec(callback)
}

function getFakeSubscription (result) {
  var user = _.sample(result.users)
  var hub = _.sample(result.hubs)

  return {
    creator: user._id,
    hub: hub._id
  }
}
