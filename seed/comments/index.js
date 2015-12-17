'use strict'

var _ = require('lodash')
var Comment = require('../../models/comment')
var Article = require('../../models/article')
var async = require('async')
var faker = require('faker')
var User = require('../../models/user')

// Settings
const COMMENTS_COUNT = 1000

module.exports = function seedComments (callback) {
  async.parallel({users: getUsers, articles: getArticles}, (err, result) => {
    if (err) return callback(err)

    var comments = _.times(COMMENTS_COUNT, (n) => getFakeComment(result))

    Comment.create(comments, callback)
  })
}

function getArticles (callback) {
  Article.find().exec(callback)
}

function getUsers (callback) {
  User.find().exec(callback)
}

function getFakeComment (result) {
  var user = _.sample(result.users)
  var article = _.sample(result.articles)

  return {
    creator: user._id,
    article: article._id,
    content: faker.hacker.phrase()
  }
}
