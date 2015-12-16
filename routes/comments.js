'use strict'

var express = require('express');
var router = express.Router();

var Comment = require('../models/comment')
var Article = require('../models/article')
var Hub = require('../models/hub')

// router.param('id', function(req, res, next, id) {
//   Article
//   .findById(id)
//   .populate('tags')
//   .exec(function(err, article) {    
//     if (err) return next(err)
//     if (!article) return next(getNotFoundError())
    
//     res.locals.article = article
//     next()
//   })
// })

// router.get('/', function(req, res, next) {
//   Article
//   .find()
//   .sort('-createdAt')
//   .populate('tags')
//   .exec(function(err, articles) {
//     if (err) return next(err)

//     res.render('articles/index', {articles})
//   })
// })


// router.get('/:id/edit', function(req, res, next) {
//   Tag.find().exec(function(err, tags) {
//     if (err) return next(err)
//     res.render('articles/edit', {tags})  
//   })
// })

router.get('/:id', function(req, res, next) {
  let id = req.params.id

  Comment
  .findById(id)
  .populate('creator')
  .populate('article')
  .exec((err, comment) => {
    res.render('comments/includes/comment', {comment})
  })
})



// router.put('/:id', function(req, res, next) {
//   let article = res.locals.article
  
//   article.title = req.body.title
//   article.content = req.body.content
//   article.slug = req.body.slug
//   article.tags = req.body.tags

//   article.save((err) => {
//     if (err) return next(err)
//     res.redirect('/articles/' + article._id + '/' + article.slug)  
//   })
// })

router.post('/', function(req, res, next) {

  var comment = new Comment({
    content: req.body.content,
    article: req.body.article,
    creator: req.user._id
  })
  
  comment.save((err) => {
    if (err) return next(err)
    res.redirect('/comments/' + comment._id)  
  })
});

module.exports = router;



function getNotFoundError () {
  var error = new Error('Article not found')
  error.status = 404
  return error
}