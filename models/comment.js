'use strict'

var mongoose = require('../config/mongoose')
var marked = require('../config/marked')

var Article = require('./article')

var Schema = mongoose.Schema

var commentSchema = new Schema({ 
  content: { 
    type: String,
    required: true
  },
  article: {
    type: Schema.Types.ObjectId, 
    ref: 'Article'
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
})

var Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment



