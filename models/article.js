'use strict'

var mongoose = require('../config/mongoose')
var marked = require('marked')
var highlightjs = require('highlight.js')

marked.setOptions({
  // renderer: new marked.Renderer(),
  gfm: true,
  tables: false,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  highlight: function (code, lang, callback) {
    return highlightjs.highlightAuto(code).value
  }
})

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
  }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

articleSchema.virtual('html').get(function () {
  return marked(this.content)
})

// articleSchema.pre('save', function (next) {
//   this.wasNew = this.isNew
//   next()
// })

// // Хук вызывается после сохранения документа
// articleSchema.post('save', function (item) {
//   if (item.parentId === 'root') return; 
//   if (!item.wasNew) return;
// })

var Article = mongoose.model('Article', articleSchema)

module.exports = Article


