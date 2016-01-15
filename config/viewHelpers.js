'use strict'

const moment = require('moment')

module.exports = function viewHelpers (req, res, next) {
  res.locals.subscribedToArticlesDigest = req.session.subscribedToArticlesDigest
  res.locals.env = process.env.NODE_ENV
  res.locals.moment = moment
  res.locals.currentUser = req.user
  next()
}
