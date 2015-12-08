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
router.get('/', getItems, getNextCount, renderIndex)

/* GET item */
router.get('/:id', getItem, getItems, getNextCount, renderShow)


/* POST create item. */
router.post('/', (req, res, next) => {

  var item = new Item(req.body)
  var redirectTo = req.query.redirectTo

  item.save((err) => {
    if (err) return next(err)
    
    if (req.xhr) {
      console.log('saved', item)
      res.render('item', {item})
    } else {
      res.redirect(redirectTo)  
    }

    
  })
})

module.exports = router



// load item for show
function getItem (req, res, next) {
  
  Item
  .findById(req.params.id)
  .exec((err, item) => {
    if (err) return next(err)
    if (!item) return next(getNotFoundError())
    res.locals.item = item
    next()
  })
}

// load items for show
function getItems (req, res, next) {
  var lastSeen = parseInt(req.query.lastSeen, 10) || new Date().getTime() 
  var parentId = req.params.id
  var condition = {createdAt: { '$lt': lastSeen }}

  if (parentId) condition.parentId = parentId

  Item
  .find(condition)
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
  var parentId = req.params.id
  var condition = {createdAt: { '$lt': lastSeen }}
  if (parentId) condition.parentId = parentId
  Item
  .count(condition)
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

function renderIndex (req, res, next) {
  var template = req.xhr ? 'list' : 'index'
  res.render(template, {
    title: 'Items list',
    parentId: ""
  })
}

function renderShow (req, res, next) {
  var item = res.locals.item
  var template = req.xhr ? (req.query.lastSeen ? 'list' : 'replies') : 'show'

  res.render(template, {
    title: item.title,
    parentId: item._id
  })
}

function getNotFoundError () {
  var error = new Error('Item not found')
  error.status=404
  return error
}