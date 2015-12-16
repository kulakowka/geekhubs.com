'use strict'

// Configs
var mongoose = require('../config/mongoose')
var marked = require('../config/marked')

// Models
var Article = require('./article')
var User = require('./user')

// Comment schema
var Schema = mongoose.Schema
var commentSchema = new Schema({
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
commentSchema.plugin(require('./plugins/deletedAt'))

// Model virtual attributes
commentSchema.virtual('html').get(function () {
  return marked(this.content)
})

// Pre save hooks
commentSchema.pre('save', function (next) {
  this.wasNew = this.isNew
  next()
})

// Post save hooks
commentSchema.post('save', function (comment) {
  if (!comment.wasNew) return

  Article.updateCommentsCount(comment.article)
  User.updateCommentsCount(comment.creator)
})

module.exports = mongoose.model('Comment', commentSchema)
