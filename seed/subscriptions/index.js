'use strict'

var _ = require('lodash')
var SubscriptionUserToHub = require('../../models/subscriptionUserToHub')
var async = require('async')
var User = require('../../models/user')
var Hub = require('../../models/hub')

module.exports = function seedSubscriptions (subscriptionsCount) {
  return (callback) => {
    async.parallel({users: getUsers, hubs: getHubs}, (err, result) => {
      if (err) return callback(err)

      var subscriptions = _.times(subscriptionsCount, (n) => getFakeSubscription(result))

      SubscriptionUserToHub.create(subscriptions, callback)
    })
  }
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
