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
var articleSchema = new Schema({
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
articleSchema.plugin(require('./plugins/deletedAt'))

// Model virtual attributes
articleSchema.virtual('html').get(function () {
  return marked(this.content)
})

articleSchema.path('hubs').set(function (hubs) {
  this._previousHubs = this.hubs
  return hubs
})

// Model static methods (Article.updateCommentsCount)
articleSchema.statics.updateCommentsCount = function (_id) {
  let self = this
  return self.model('Comment').count({ article: _id }, function (err, commentsCount) {
    if (err) return console.log(err)
    self.findOneAndUpdate({_id}, {$set: {commentsCount}}, (err) => {
      if (err) return console.log(err)
    })
  })
}

// Pre save hooks
articleSchema.pre('save', function (next) {
  this.wasNew = this.isNew
  this.slug = slug(this.title)
  next()
})

// Post save hooks
articleSchema.post('save', function (article) {
  var hubs = this._previousHubs.concat(this.hubs || [])
  hubs = _.uniq(hubs.map(hub => hub.toString()))

  Hub.updateArticlesCountHubs(hubs)
})

articleSchema.post('save', function (article) {
  if (!this.wasNew) return
  User.updateArticlesCount(this.creator)
})

module.exports = mongoose.model('Article', articleSchema)
