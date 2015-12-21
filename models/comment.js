'use strict'

// Configs
var mongoose = require('../config/mongoose')
var marked = require('../config/marked')

// Models
var Article = require('./article')
var User = require('./user')

// Services 
var SendEmail = require('../services/emails/sendEmail')

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

  Article.findById(comment.article).populate('creator hubs').exec((err, article) => {
    if (err) return;
    if (!article.creator.email) return;

    SendEmail({
      title: 'New comment to your article «' + article.title + '»',
      user: article.creator,
      article: article,
      comment: comment,  // without comment.html virtual method
      template: 'comments/new-comment-email'
    })
  })
  
})

module.exports = mongoose.model('Comment', schema)
