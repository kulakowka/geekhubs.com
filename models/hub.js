'use strict'

// Packages
var slug = require('limax')

// Configs
var mongoose = require('../config/mongoose')

// Models
var User = require('./user')

// Hub schema
var Schema = mongoose.Schema
var schema = new Schema({
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
    index: true,
    // unique: true,
    lowercase: true,
    trim: true,
    maxlength: 100
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  articlesCount: {
    type: Number,
    required: true,
    default: 0
  },
  subscribersCount: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

// Model static methods (Hub.updateArticlesCountHubs)
schema.statics.updateArticlesCountHubs = function (hubs) {
  let self = this
  hubs.forEach(id => self.updateArticlesCount(id))
}

schema.statics.updateArticlesCount = function (_id) {
  let self = this
  return self.model('Article').count({hubs: {$in: [_id]}}, function (err, articlesCount) {
    if (err) return console.log(err)
    self.findOneAndUpdate({_id}, {$set: {articlesCount}}, (err, hub) => {
      if (err) return console.log(err)
    })
  })
}

schema.statics.updateSubscribersCount = function (_id) {
  let self = this
  return self.model('SubscriptionUserToHub').count({hub: _id}, function (err, subscribersCount) {
    if (err) return console.log(err)
    self.findOneAndUpdate({_id}, {$set: {subscribersCount}}, (err, hub) => {
      if (err) return console.log(err)
    })
  })
}

// Pre save hooks
schema.pre('save', function (next) {
  this.wasNew = this.isNew
  this.slug = slug(this.title)
  next()
})

// Post save hooks
schema.post('save', function (hub) {
  if (!hub.wasNew) return
  User.incrementHubsCount(hub.creator)
})

module.exports = mongoose.model('Hub', schema)
