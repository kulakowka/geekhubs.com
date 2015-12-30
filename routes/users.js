'use strict'

// Packages
const express = require('express')
const router = express.Router()

// Models
const SubscriptionUserToHub = require('../models/subscriptionUserToHub')
const User = require('../models/user')
const Comment = require('../models/comment')
const Article = require('../models/article')
const Hub = require('../models/hub')

// Error responses
const getNotFoundError = require('./errors/notFound')

// GET /users
router.get('/', (req, res, next) => {
  var options = {
    perPage: 10,
    delta: 3,
    page: req.query.page
  }
  User
  .find()
  .sort('-createdAt')
  .limit(30)
  .paginater(options, (err, data) => {
    if (err) return next(err)

    res.render('users/index', data)
  })
})

// GET /users/:username
router.get('/:username', loadUser, (req, res, next) => {
  res.render('users/show')
})

// GET /users/:username/articles
router.get('/:username/articles', loadUser, (req, res, next) => {
  const user = res.locals.user
  var options = {
    perPage: 10,
    delta: 3,
    page: req.query.page
  }

  Article
  .find({creator: user._id})
  .sort('-createdAt')
  .populate('hubs')
  .populate('creator')
  .paginater(options, (err, data) => {
    if (err) return next(err)

    res.render('users/articles/index', data)
  })
})

// GET /users/:username/hubs
router.get('/:username/hubs', loadUser, loadSubscriptions, (req, res, next) => {
  const subscriptions = res.locals.subscriptions || []
  const subscribedHubsIds = subscriptions.map(subscription => subscription.hub.toString())
  const user = res.locals.user
  var options = {
    perPage: 10,
    delta: 3,
    page: req.query.page
  }
  Hub
  .find({creator: user._id})
  .sort('-createdAt')
  .populate('creator')
  .paginater(options, (err, data) => {
    if (err) return next(err)

    res.locals.isSubscribed = (hub) => {
      const id = hub._id.toString()
      return subscribedHubsIds.indexOf(id) !== -1
    }

    res.render('users/hubs/index', data)
  })
})

// GET /users/:username/comments
router.get('/:username/comments', loadUser, (req, res, next) => {
  const user = res.locals.user
  var options = {
    perPage: 10,
    delta: 3,
    page: req.query.page
  }
  Comment
  .find({creator: user._id})
  .sort('-createdAt')
  .populate('article')
  .populate('creator')
  .paginater(options, (err, data) => {
    if (err) return next(err)
    res.render('users/comments/index', data)
  })
})

module.exports = router

// Middlewares for this router

function loadUser (req, res, next) {
  User
  .findOne({username: req.params.username})
  .exec((err, user) => {
    if (err) return next(err)
    if (!user) return next(getNotFoundError('User not found'))

    res.locals.user = user
    next()
  })
}

function loadSubscriptions (req, res, next) {
  if (!req.user) return next()

  SubscriptionUserToHub
  .find({creator: req.user._id})
  .exec((err, subscriptions) => {
    if (err) return next(err)
    res.locals.subscriptions = subscriptions
    next()
  })
}
