'use strict'


var express = require('express');
var router = express.Router();

var Article = require('../models/article')
var Hub = require('../models/hub')



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

router.get('/:slug', function(req, res, next) {
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

  
})

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

router.post('/', function(req, res, next) {

  var hub = new Hub({
    title: req.body.title,
    slug: req.body.slug,
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