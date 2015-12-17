'use strict'

// Packages
var express = require('express')
var router = express.Router()

// Models
var SubscriptionUserToHub = require('../models/subscriptionUserToHub')

// Policies
const ifUser = require('./policies/ifUser')

// POST /subscription/:hubId/create
router.post('/hub/:hubId/create', ifUser, loadSubscription, function (req, res, next) {
  let subscription = req.subscription
  if (subscription) return res.json({subscription})

  SubscriptionUserToHub
  .create({creator: req.user._id, hub: req.params.hubId}, (err, subscription) => {
    if (err) return next(err)
    res.json({subscription})
  })
})

// POST /subscription/:hubId/remove
router.post('/hub/:hubId/remove', ifUser, function (req, res, next) {
  SubscriptionUserToHub
  .remove({creator: req.user._id, hub: req.params.hubId})
  .exec((err, result) => {
    if (err) return next(err)
    res.json({result})
  })
})

module.exports = router

// Middlewares for this router

function loadSubscription (req, res, next) {
  SubscriptionUserToHub
  .findOne({creator: req.user._id, hub: req.params.hubId})
  .exec((err, subscription) => {
    if (err) return next(err)
    req.subscription = subscription
    next()
  })
}
