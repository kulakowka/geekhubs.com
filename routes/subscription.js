'use strict'

// Packages
var express = require('express')
var router = express.Router()

// Models
var SubscriptionUserToHub = require('../models/subscriptionUserToHub')
var SubscriptionUserToArticle = require('../models/subscriptionUserToArticle')

// Policies
const ifUser = require('./policies/ifUser')

// POST /subscription
router.post('/', function (req, res, next) {
  let email = req.body.email
  let creator = req.user && req.user._id

  SubscriptionUserToArticle
  .create({email, creator}, function (err, subscription) {
    if (err) return next(err)
    req.session.subscribedToArticlesDigest = true
    res.json({subscription})
  })
})

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
  .findOne({creator: req.user._id, hub: req.params.hubId})
  .exec((err, subscription) => {
    if (err) return next(err)
    subscription.remove((err, result) => {
      if (err) return next(err)
      res.json({subscription})
    })
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
