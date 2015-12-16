'use strict'

var mongoose = require('../config/mongoose')
var marked = require('../config/marked')

var Article = require('./article')
var User = require('./user')
//var Hub = require('./hub')

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

commentSchema.virtual('html').get(function () {
  return marked(this.content)
})

commentSchema.pre('save', function (next) {
  this.wasNew = this.isNew
  next()
})

// Хук вызывается после сохранения документа
commentSchema.post('save', function (comment) {
  if (!comment.wasNew) return

  Article.updateCommentsCount(comment.article, (err) => {
    console.log('Error', err)
  })
  User.updateCommentsCount(comment.creator, (err) => {
    console.log('Error', err)
  })
})

var Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment



