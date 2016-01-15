'use strict'

// Packages
var moment = require('moment')
var async = require('async')

// Models
var Article = require('../../models/article')
var Hub = require('../../models/hub')
var User = require('../../models/user')

// sidebar
module.exports = function (req, res, next) {
  let time = moment().startOf('year')

  async.parallel({
    topArticles (callback) {
      Article
      .find({createdAt: {$gte: time}})
      .sort('-commentsCount')
      .limit(10)
      .exec(callback)
    },
    topWriters (callback) {
      User
      .find({createdAt: {$gte: time}})
      .sort('-articlesCount')
      .limit(10)
      .exec(callback)
    },
    topHubs (callback) {
      Hub
      .find({createdAt: {$gte: time}})
      .sort('-articlesCount')
      .limit(10)
      .exec(callback)
    }
  }, (err, result) => {
    if (err) return next(err)
    Object.assign(res.locals, result)
    next()
  })
}
