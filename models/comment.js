'use strict'

// Configs
var mongoose = require('../config/mongoose')
var marked = require('../config/marked')

// Models
var Article = require('./article')
var User = require('./user')

// Comment schema
var Schema = mongoose.Schema
var schema = new Schema({
  content: {
    type: String,
    required: true
  },
  article: {
    type: Schema.Types.ObjectId,
    index: true,
    ref: 'Article'
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

// Model plugins
schema.plugin(require('./plugins/deletedAt'))

// Model virtual attributes
schema.virtual('html').get(function () {
  return marked(this.content)
})

// Pre save hooks
schema.pre('save', function (next) {
  this.wasNew = this.isNew
  next()
})

// Post save hooks
schema.post('save', function (comment) {
  if (!comment.wasNew) return

  Article.incrementCommentsCount(comment.article)
  User.incrementCommentsCount(comment.creator)
})

module.exports = mongoose.model('Comment', schema)
