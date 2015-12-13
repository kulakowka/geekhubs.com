'use strict'
var moment = require('moment')
var express = require('express');
var router = express.Router();

var Article = require('../models/article')

// view helpers
router.use(getViewHelpers)

router.param('id', function(req, res, next, id) {
  Article.findById(id).exec(function(err, article) {    
    if (err) return next(err)
    if (!article) return next(getNotFoundError())
    
    res.locals.article = article
    next()
  })
})

router.get('/', function(req, res, next) {
  Article.find().sort('-createdAt').exec(function(err, articles) {
    if (err) return next(err)

    res.render('articles/index', {articles})
  })
})

router.get('/new', function(req, res, next) {
  res.render('articles/new', {article: {}})
})

router.get('/:id/edit', function(req, res, next) {
  res.render('articles/edit')
})

router.get('/:id/:slug', function(req, res, next) {
  res.render('articles/show')
})



router.put('/:id', function(req, res, next) {
  let article = res.locals.article
  
  article.title = req.body.title
  article.content = req.body.content
  article.slug = req.body.slug

  article.save((err) => {
    if (err) return next(err)
    res.redirect('/articles/' + article._id + '/' + article.slug)  
  })
})

router.post('/', function(req, res, next) {

  var article = new Article({
    title: req.body.title,
    content: req.body.content,
    slug: req.body.slug
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