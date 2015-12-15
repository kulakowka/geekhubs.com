'use strict'

var express = require('express');
var router = express.Router();

var Comment = require('../models/comment')
var Article = require('../models/article')
var Tag = require('../models/tag')

router.param('id', function(req, res, next, id) {
  Article
  .findById(id)
  .populate('tags')
  .populate('creator')
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
  .populate('creator')
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
  let article = res.locals.article

  Comment
  .find({article: article._id})
  .sort('createdAt')
  .exec((err, comments) => {
    res.render('articles/show', {comments, comment: {}})  
  })
})



router.put('/:id', function(req, res, next) {
  let article = res.locals.article
  
  let lastTags = article.tags.map(tag => tag._id.toString())
  let newTags = req.body.tags
  let set = new Set(lastTags.concat(newTags))
  let tags = Array.from(set)
    
  article.title = req.body.title
  article.summary = req.body.summary
  article.content = req.body.content
  article.slug = req.body.slug
  article.tags = req.body.tags

  article.save((err, article) => {
    if (err) return next(err)
    res.redirect('/articles/' + article._id + '/' + article.slug)  
    
    Tag.updateArticlesCount(tags)
  })
})

router.post('/', function(req, res, next) {
  
  var article = new Article({
    title: req.body.title,
    summary: req.body.summary,
    content: req.body.content,
    slug: req.body.slug,
    tags: req.body.tags,
    creator: req.user._id
  })
  
  article.save((err, article) => {
    if (err) return next(err)
    res.redirect('/articles/' + article._id + '/' + article.slug)  

    Tag.updateArticlesCount(article.tags)
  })
});

module.exports = router;



function getNotFoundError () {
  var error = new Error('Article not found')
  error.status = 404
  return error
}