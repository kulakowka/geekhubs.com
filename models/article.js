'use strict'

var mongoose = require('../config/mongoose')
var marked = require('../config/marked')

var Comment = require('./comment')
var Tag = require('./tag')

var Schema = mongoose.Schema

var articleSchema = new Schema({ 
  title: { 
    type: String,
    required: true
  },
  slug: { 
    type: String,
    required: true,
    index: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 200
  },
  content: { 
    type: String,
    required: true
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  tags : [{ type: Schema.Types.ObjectId, ref: 'Tag' }]

}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

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

var Article = mongoose.model('Article', articleSchema)

module.exports = Article


