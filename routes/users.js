'use strict'

var express = require('express');
var router = express.Router();

var SubscriptionUserToHub = require('../models/subscriptionUserToHub')
var User = require('../models/user')
var Comment = require('../models/comment')
var Article = require('../models/article')
var Hub = require('../models/hub')

router.param('username', function(req, res, next, username) {
  User
  .findOne({username})
  .exec(function(err, user) {    
    if (err) return next(err)
    if (!user) return next(getNotFoundError())
    
    res.locals.user = user
    next()
  })
})

router.get('/', function(req, res, next) {
  User
  .find()
  .sort('-createdAt')
  .limit(30)
  .exec(function(err, users) {
    if (err) return next(err)

    res.render('users/index', {users})
  })
})

router.get('/:username/edit', function(req, res, next) {
  res.render('users/edit')  
})

router.get('/:username', function(req, res, next) {
  res.render('users/show')
})

router.get('/:username/articles', function(req, res, next) {
  let user = res.locals.user
  Article
  .find({creator: user._id})
  .sort('-createdAt')
  .populate('hubs')
  .populate('creator')
  .exec(function(err, articles) {
    if (err) return next(err)

    res.render('users/articles/index', {articles})
  })
})

router.get('/:username/hubs', 
  function(req, res, next) {
    if (!req.user) return next()
    let user = res.locals.user

    SubscriptionUserToHub
    .findOne({creator: user._id})
    .populate({
      path: 'hubs',
      select: '_id'
    })
    .exec(function(err, subscription) {
      if (err) return next(err)
      if (!subscription) return next()

      var subscribedHubsIds = subscription.hubs.map(hub => hub._id.toString())

      res.locals.isSubscribed = function(hub) {
        let id = hub._id.toString()
        return subscribedHubsIds.indexOf(id) !== -1
      }
      next()
    })
  },
  function(req, res, next) {
    let user = res.locals.user
    Hub
    .find({creator: user._id})
    .sort('-createdAt')
    .populate('creator')
    .exec(function(err, hubs) {
      if (err) return next(err)

      res.render('users/hubs/index', {hubs})
    })
  }
)

router.get('/:username/comments', function(req, res, next) {
  let user = res.locals.user
  Comment
  .find({creator: user._id})
  .sort('-createdAt')
  .populate('article')
  .populate('creator')
  .exec(function(err, comments) {
    if (err) return next(err)

    res.render('users/comments/index', {comments})
  })
})

router.put('/:username', function(req, res, next) {
  let user = res.locals.user
  
  user.email = req.body.email
  user.username = req.body.username
  user.password = req.body.password
  
  user.save((err) => {
    if (err) return next(err)
    res.redirect('/users/' + user.username)  
  })
})

router.post('/', function(req, res, next) {
  let user = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  })
  
  user.save((err) => {
    if (err) return next(err)
    res.redirect('/users/' + user.username)
  })
})

module.exports = router;

// function ifUserExists (req, res, next) {
//   User
//   .findOne({ $or: [
//     { username: req.body.username }, 
//     { email: req.body.email }
//   ]})
//   .exec((err, user) => {
//     if (err) return next(err)
//     if (!user) return next()
//     return res.status(400).json({error: 'A user with that username or email already exists'})
//   })
// }


function getNotFoundError () {
  var error = new Error('User not found')
  error.status = 404
  return error
}

