'use strict'

var mongoose = require('../config/mongoose')

var Schema = mongoose.Schema

var tagSchema = new Schema({ 
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
  }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

var Tag = mongoose.model('Tag', tagSchema)

module.exports = Tag


