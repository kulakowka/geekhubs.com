'use strict'

var express = require('express')
var router = express.Router()
var moment = require('moment')
var Item = require('../config/db').Item

// show 5 items per page
var PERPAGE = 5

// view helpers
router.use(getViewHelpers)

/* GET items list */
router.get('/', getItems, getNextCount, (req, res, next) => {
  var template = req.xhr ? 'list' : 'index'
  res.render(template, {
    title: 'Items list'
  })
})

/* GET item */
router.get('/:id', getItem, (req, res, next) => {
  res.render('show', {
    title: res.locals.item.title
  })
})


/* POST create item. */
router.post('/', (req, res, next) => {
  var item = new Item(req.body)
  item.save(err => {
    if (err) return next(err)
    res.redirect('/')
  })
})

module.exports = router



// load item for show
function getItem (req, res, next) {
  
  Item
  .findById(req.params.id)
  .exec((err, item) => {
    if (err) return next(err)
    res.locals.item = item
    next()
  })
}

// load items for show
function getItems (req, res, next) {
  var lastSeen = parseInt(req.query.lastSeen, 10) || new Date().getTime()

  Item
  .find({createdAt: { '$lt': lastSeen }})
  .limit(PERPAGE)
  .sort({ createdAt: -1 })
  .exec((err, items) => {
    if (err) return next(err)
    res.locals.items = items
    next()
  })
}

// get next items count for current items
function getNextCount (req, res, next) {
  var lastSeen = getLastSeen(res.locals.items)

  Item
  .count({createdAt: { '$lt': lastSeen }})
  .exec((err, count) => {
    if (err) return next(err)
    res.locals.nextCount = count
    next()
  })
}

// get last created at from items array
function getLastSeen (items) {
  if (!items.length) return 0
  var item = items.slice(-1).pop()
  return item.createdAt.getTime() || 0
}

// view helpers middleware
function getViewHelpers (req, res, next) {
  res.locals.moment = moment
  res.locals.lastSeen = getLastSeen
  next()
}
