'use strict'

// Packages
var express = require('express')
var router = express.Router()

// Models
var Comment = require('../models/comment')
var Article = require('../models/article')
var Hub = require('../models/hub')
var SubscriptionUserToHub = require('../models/subscriptionUserToHub')

// Policies
const ifUser = require('./policies/ifUser')

// Error responses
const getForbiddenError = require('./errors/forbidden')
const getNotFoundError = require('./errors/notFound')

// GET /articles
router.get('/', (req, res, next) => {
  var options = {
    perPage: 10,
    delta: 3,
    page: req.query.page
  }

  Article
  .find()
  .sort('-createdAt')
  .populate('hubs')
  .populate('creator')
  .paginater(options, (err, data) => {
    if (err) return next(err)
    res.render('articles/index', data)
  })
})

// GET /articles/subscription
router.get('/subscription', ifUser, loadSubscriptions, (req, res, next) => {
  let subscriptions = res.locals.subscriptions
  let hubs = subscriptions.map(subscription => subscription.hub)
  var options = {
    perPage: 10,
    delta: 3,
    page: req.query.page
  }

  Article
  .find({hubs: {$in: hubs}})
  .sort('-createdAt')
  .populate('hubs')
  .populate('creator')
  .paginater(options, (err, data) => {
    if (err) return next(err)
    res.render('articles/subscription', data)
  })
})

// GET /articles/new
router.get('/new', ifUser, loadHubs, (req, res, next) => {
  res.render('articles/new', {article: {}})
})

// GET /articles/:id/edit
router.get('/:id/edit', ifUser, loadArticle, ifCanEdit, loadHubs, (req, res, next) => {
  res.render('articles/edit')
})

// GET /articles/:id/:slug
router.get('/:id/:slug', loadArticle, function (req, res, next) {
  let article = res.locals.article

  Comment
  .find({article: article._id})
  .sort('createdAt')
  .populate('creator')
  .populate('article')
  .exec((err, comments) => {
    if (err) return next(err)
    res.render('articles/show', {results: comments, comment: {}})
  })
})

// PUT /articles/:id
router.put('/:id', ifUser, loadArticleNoPopulate, ifCanEdit, (req, res, next) => {
  let article = res.locals.article

  Object.assign(article, {
    title: req.body.title,
    summary: req.body.summary,
    content: req.body.content,
    hubs: req.body.hubs
  })

  article.save((err, article) => {
    if (err) return next(err)
    res.json({article})
  })
})

// POST /articles
router.post('/', ifUser, (req, res, next) => {
  var article = new Article({
    title: req.body.title,
    summary: req.body.summary,
    content: req.body.content,
    hubs: req.body.hubs,
    creator: req.user._id
  })

  article.save((err, article) => {
    if (err) return next(err)
    res.json({article})
  })
})

module.exports = router

// Middlewares for this router

function loadArticleNoPopulate (req, res, next) {
  Article
  .findById(req.params.id)
  .exec((err, article) => {
    if (err) return next(err)
    if (!article) return next(getNotFoundError('Article not found'))
    res.locals.article = article
    next()
  })
}
function loadArticle (req, res, next) {
  let id = req.params.id

  Article
  .findById(id)
  .populate('hubs')
  .populate('creator')
  .exec((err, article) => {
    if (err) return next(err)
    if (!article) return next(getNotFoundError('Article not found'))
    res.locals.article = article
    next()
  })
}

function loadHubs (req, res, next) {
  Hub.find().exec((err, hubs) => {
    if (err) return next(err)
    res.locals.hubs = hubs
    next()
  })
}

function loadSubscriptions (req, res, next) {
  SubscriptionUserToHub
  .find({creator: req.user._id})
  .populate('hub')
  .exec((err, subscriptions) => {
    if (err) return next(err)
    res.locals.subscriptions = subscriptions
    next()
  })
}

function ifCanEdit (req, res, next) {
  let article = res.locals.article
  if (!req.user.can('edit', article)) return next(getForbiddenError())
  next()
}
