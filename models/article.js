'use strict'

// Packages
var slug = require('limax')
var _ = require('lodash')

// Configs
var mongoose = require('../config/mongoose')
var marked = require('../config/marked')

// Models
var User = require('./user')
var Hub = require('./hub')

// Article schema
var Schema = mongoose.Schema
var schema = new Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    lowercase: true,
    trim: true,
    maxlength: 200
  },
  summary: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  hubs: [{
    type: Schema.Types.ObjectId,
    ref: 'Hub'
  }]
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

// Model plugins
schema.plugin(require('./plugins/deletedAt'))

// Model virtual attributes
schema.virtual('html').get(function () {
  return marked(this.content)
})

schema.path('hubs').set(function (hubs) {
  this._previousHubs = this.hubs
  return hubs
})

// Model static methods (Article.updateCommentsCount)
schema.statics.updateCommentsCount = function (_id) {
  let self = this
  return self.model('Comment').count({ article: _id }, function (err, commentsCount) {
    if (err) return console.log(err)
    self.findOneAndUpdate({_id}, {$set: {commentsCount}}, (err) => {
      if (err) return console.log(err)
    })
  })
}

schema.statics.incrementCommentsCount = function (_id) {
  return this.findOneAndUpdate({_id}, {$inc: {commentsCount: 1}}, function (err) {
    if (err) return console.log(err)
  })
}

// Pre save hooks
schema.pre('save', function (next) {
  this.wasNew = this.isNew
  this.slug = slug(this.title)
  next()
})

// Post save hooks
schema.post('save', function (article) {
  var hubs = this._previousHubs.concat(this.hubs || [])
  hubs = _.uniq(hubs.map(hub => hub.toString()))

  Hub.updateArticlesCountHubs(hubs)
})

schema.post('save', function (article) {
  if (!this.wasNew) return
  User.incrementArticlesCount(this.creator)
})

module.exports = mongoose.model('Article', schema)
