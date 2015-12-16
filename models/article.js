'use strict'

var mongoose = require('../config/mongoose')
var marked = require('../config/marked')
var slug = require('limax')

// Models
var User = require('./user')
//var Comment = require('./comment')
//var Hub = require('./hub')

// Mongoose plugins
var deletedAt = require('./plugins/deletedAt')

var Schema = mongoose.Schema

var articleSchema = new Schema({ 
  title: { 
    type: String,
    required: true
  },
  slug: { 
    type: String,
    required: true,
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
  hubs : [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Hub' 
  }]

}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })


articleSchema.plugin(deletedAt)

articleSchema.virtual('html').get(function () {
  return marked(this.content)
})

articleSchema.methods.getCommentsCount = function (cb) {
  return this.model('Comment').count({ article: this._id }, cb);
}

articleSchema.statics.updateCommentsCount = function (id, cb) {
  return this.findById(id, (err, article) => {
    if (err) return cb(err)

    article.getCommentsCount((err, count) => {
      if (err) return cb(err)

      article.commentsCount = count
      article.save(cb)
    })
  })
}

articleSchema.pre('save', function (next) {
  this.wasNew = this.isNew
  if (this.title) this.slug = slug(this.title)
  next()
})

// Хук вызывается после сохранения документа
articleSchema.post('save', function (article) {
  if (!article.wasNew) return

  User.updateArticlesCount(article.creator, (err) => {
    console.log('Error', err)
  })
})

var Article = mongoose.model('Article', articleSchema)

module.exports = Article


