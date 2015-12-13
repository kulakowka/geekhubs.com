'use strict'


var express = require('express');
var router = express.Router();

var Tag = require('../models/tag')

router.param('slug', function(req, res, next, slug) {
  Tag.findOne({slug}).exec(function(err, tag) {    
    if (err) return next(err)
    if (!tag) return next(getNotFoundError())
    
    res.locals.tag = tag
    next()
  })
})

router.get('/', function(req, res, next) {
  Tag.find().sort('-createdAt').exec(function(err, tags) {
    if (err) return next(err)

    res.render('tags/index', {tags})
  })
})

router.get('/new', function(req, res, next) {
  res.render('tags/new', {tag: {}})
})

router.get('/:slug/edit', function(req, res, next) {
  res.render('tags/edit')
})

router.get('/:slug', function(req, res, next) {
  res.render('tags/show')
})

router.put('/:slug', function(req, res, next) {
  let tag = res.locals.tag
  
  tag.title = req.body.title
  tag.slug = req.body.slug

  tag.save((err) => {
    if (err) return next(err)
    res.redirect('/tags/' + tag.slug)  
  })
})

router.post('/', function(req, res, next) {

  var tag = new Tag({
    title: req.body.title,
    slug: req.body.slug
  })
  
  tag.save((err) => {
    if (err) return next(err)
    res.redirect('/tags/' + tag.slug)  
  })
});

module.exports = router;

function getNotFoundError () {
  var error = new Error('Tag not found')
  error.status = 404
  return error
}