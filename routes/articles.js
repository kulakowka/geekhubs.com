'use strict'
var moment = require('moment')
var express = require('express');
var router = express.Router();

var Article = require('../models/article')
var Tag = require('../models/tag')

// view helpers
router.use(getViewHelpers)

router.param('id', function(req, res, next, id) {
  Article
  .findById(id)
  .populate('tags')
  .exec(function(err, article) {    
    if (err) return next(err)
    if (!article) return next(getNotFoundError())
    
    res.locals.article = article
    next()
  })
})

router.get('/', function(req, res, next) {
  Article
  .find()
  .sort('-createdAt')
  .populate('tags')
  .exec(function(err, articles) {
    if (err) return next(err)

    res.render('articles/index', {articles})
  })
})

router.get('/new', function(req, res, next) {
  Tag.find().exec(function(err, tags) {
    if (err) return next(err)
    res.render('articles/new', {article: {}, tags})  
  })
  
})

router.get('/:id/edit', function(req, res, next) {
  Tag.find().exec(function(err, tags) {
    if (err) return next(err)
    res.render('articles/edit', {tags})  
  })
})

router.get('/:id/:slug', function(req, res, next) {
  res.render('articles/show')
})



router.put('/:id', function(req, res, next) {
  let article = res.locals.article
  
  article.title = req.body.title
  article.content = req.body.content
  article.slug = req.body.slug
  article.tags = req.body.tags

  article.save((err) => {
    if (err) return next(err)
    res.redirect('/articles/' + article._id + '/' + article.slug)  
  })
})

router.post('/', function(req, res, next) {


  var article = new Article({
    title: req.body.title,
    content: req.body.content,
    slug: req.body.slug,
    tags: req.body.tags
  })
  
  article.save((err) => {
    if (err) return next(err)
    res.redirect('/articles/' + article._id + '/' + article.slug)  
  })
});

module.exports = router;


function getViewHelpers (req, res, next) {
  res.locals.moment = moment
  next()
}

function getNotFoundError () {
  var error = new Error('Article not found')
  error.status = 404
  return error
}