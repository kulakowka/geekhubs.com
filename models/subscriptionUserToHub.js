'use strict'

// Configs
var mongoose = require('../config/mongoose')

// Models
var Hub = require('./hub')

// SubscriptionUserToHub schema
var Schema = mongoose.Schema
var schema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  hub: {
    type: Schema.Types.ObjectId,
    ref: 'Hub',
    index: true,
    required: true
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
  Hub.updateSubscribersCount(this.hub)
})

schema.post('remove', function (subscription) {
  Hub.updateSubscribersCount(this.hub)
})

module.exports = mongoose.model('SubscriptionUserToHub', schema)
