'use strict'

var _ = require('lodash')
var Article = require('../../models/article')
var async = require('async')
var faker = require('faker')
var Hub = require('../../models/hub')
var User = require('../../models/user')

module.exports = function seedArticles (articlesCount) {
  return (callback) => {
    async.parallel({users: getUsers, hubs: getHubs}, (err, result) => {
      if (err) return callback(err)

      var articles = _.times(articlesCount, (n) => getFakeArticle(result))

      Article.create(articles, callback)
    })
  }
}

function getUsers (callback) {
  User.find().exec(callback)
}

function getHubs (callback) {
  Hub.find().exec(callback)
}

function getFakeArticle (result) {
  var user = _.sample(result.users)
  var hubs = _.sample(result.hubs, _.random(0, 10)).map(hub => hub._id)

  return {
    hubs: hubs,
    creator: user._id,
    title: faker.name.title(),
    summary: faker.lorem.paragraph(),
    content: faker.lorem.paragraphs()
  }
}

