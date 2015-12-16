'use strict'

// Packages
var slug = require('limax')

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
  if (this.isModified('title')) this.slug = slug(this.title)
  next()
})

// Post save hooks
articleSchema.post('save', function (article) {
  if (!this.wasNew) return

  Hub.updateArticlesCountHubs(this.hubs)
  User.updateArticlesCount(this.creator)
})

module.exports = mongoose.model('Article', articleSchema)
