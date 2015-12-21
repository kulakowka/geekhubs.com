'use strict'

// Configs
var mongoose = require('../config/mongoose')

// Models
var User = require('./user')

// SubscriptionUserToArticle schema
var Schema = mongoose.Schema
var schema = new Schema({
  email: {
    index: true,
    lowercase: true,
    trim: true,
    type: String,
    required: true,
    unique: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

// Pre save hooks
schema.pre('save', function (next) {
  this.wasNew = this.isNew
  next()
})

// Post save hooks
schema.post('save', function (subscription) {
  if (!this.wasNew) return

  User.update({_id: this.creator}, {subscribedToArticlesDigest: true}).exec()
})

schema.post('remove', function (subscription) {
  User.update({_id: this.creator}, {subscribedToArticlesDigest: false}).exec()
})

module.exports = mongoose.model('SubscriptionUserToArticle', schema)
