'use strict'


var express = require('express');
var router = express.Router();

var Article = require('../models/article')
var Hub = require('../models/hub')
var SubscriptionUserToHub = require('../models/subscriptionUserToHub')

// Policies
var ifGuest = require('./policies/ifGuest')
var ifUser = require('./policies/ifUser')
var ifAdmin = require('./policies/ifAdmin')


router.param('slug', function(req, res, next, slug) {
  Hub
  .findOne({slug})
  .populate('creator')
  .exec(function(err, hub) {    
    if (err) return next(err)
    if (!hub) return next(getNotFoundError())
    
    res.locals.hub = hub
    next()
  })
})

router.get('/', function(req, res, next) {
  Hub
  .find()
  .populate('creator')
  .sort('-createdAt')
  .exec(function(err, hubs) {
    if (err) return next(err)

    res.render('hubs/index', {hubs})
  })
})

router.get('/new', function(req, res, next) {
  res.render('hubs/new', {hub: {}})
})

router.get('/:slug/edit', function(req, res, next) {
  res.render('hubs/edit')
})

router.get('/:slug', 
  function(req, res, next) {
    if (!req.user) return next()

    let hub = res.locals.hub

    SubscriptionUserToHub
    .findOne({creator: req.user._id, hubs: { $in: [hub._id]}})
    .populate({
      path: 'hubs',
      match: {
        _id: hub._id
      },
      select: '_id'
    })
    .exec(function(err, subscription) {
      if (err) return next(err)
      if (!subscription) return next()

      res.locals.subscription = subscription
      next()
    })
  },
  function(req, res, next) {
    let hub = res.locals.hub

    Article
    .find({hubs: { $in: [hub._id] }})
    .populate('hubs')
    .populate('creator')
    .sort('-createdAt')
    .exec(function(err, articles) {
      if (err) return next(err)

      res.render('hubs/show', {articles})  
    })
  }
)

router.put('/:slug', function(req, res, next) {
  let hub = res.locals.hub
  
  hub.title = req.body.title
  hub.slug = req.body.slug
  hub.description = req.body.description

  hub.save((err) => {
    if (err) return next(err)
    res.redirect('/hubs/' + hub.slug)  
  })
})

router.post('/:slug/subscribe', ifUser, 
  // if subscription exists. add hub to array
  function(req, res, next) {
    let hub = res.locals.hub
    
    SubscriptionUserToHub
    .findOne({creator: req.user._id})
    .exec(function(err, subscription) {
      if (err) return next(err)
      if (!subscription) return next()
      if (subscription.hubs.indexOf(hub._id) !== -1) return res.json({subscription})

      subscription.hubs.push(hub._id)
      subscription.save((err, subscription) => {
        if (err) return next(err)
        res.json({subscription})
      })
    })
  }, 
  // if subscription does not exists. create subscription with one hub.
  function(req, res, next) {
    
    let hub = res.locals.hub
    var subscription = new SubscriptionUserToHub({
      creator: req.user._id,
      hubs: [hub._id]
    })

    subscription.save((err, subscription) => {
      if (err) return next(err)
      res.json({subscription})
    })
  }
)

// if subscription exist, remove hub from array;
router.post('/:slug/unsubscribe', ifUser, function(req, res, next) {
  let hub = res.locals.hub
  
  SubscriptionUserToHub
  .findOne({creator: req.user._id, hubs: { $in: [hub._id]}})
  .exec(function(err, subscription) {
    if (err) return next(err)
    if (!subscription) return res.status(400).json({error: 'Subscription not found'})
    
    let index = subscription.hubs.indexOf(hub._id)

    subscription.hubs.splice(index, 1)
    subscription.save((err, subscription) => {
      if (err) return next(err)
      res.json({subscription})
    })
  })
})

router.post('/', function(req, res, next) {

  var hub = new Hub({
    title: req.body.title,
    description: req.body.description,
    creator: req.user._id
  })
  
  hub.save((err) => {
    if (err) return next(err)
    res.redirect('/hubs/' + hub.slug)  
  })
});

module.exports = router;

function getNotFoundError () {
  var error = new Error('Hub not found')
  error.status = 404
  return error
}