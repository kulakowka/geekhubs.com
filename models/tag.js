'use strict'

var mongoose = require('../config/mongoose')

var Schema = mongoose.Schema

var tagSchema = new Schema({ 
  title: { 
    type: String,
    trim: true,
    maxlength: 80,
    required: true
  },
  description: { 
    type: String,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    index: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 100
  },
  // meta information
  articlesCount: {
    type: Number,
    required: true,
    //index: true,
    default: 0
  },

}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

// Tag methods for articles

tagSchema.statics.updateArticlesCount = function (tags) {
  return this.find({_id: { $in: tags }}, (err, tags) => {
    tags.forEach(tag => tag.updateArticlesCount())
  })
}

tagSchema.methods.updateArticlesCount = function () {
  let tag = this
  
  this.model('Article').count({ tags: { $in: [this._id] } }, (err, count) => {
    if (err) return console.log('Error', err)

    tag.articlesCount = count
    tag.save(err => {
      if (err) return console.log('Error', err)
    })
  })
}

var Tag = mongoose.model('Tag', tagSchema)

module.exports = Tag


