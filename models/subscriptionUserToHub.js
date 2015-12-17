'use strict'

// Configs
var mongoose = require('../config/mongoose')

// SubscriptionUserToHub schema
var Schema = mongoose.Schema
var subscriptionUserToHubSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  hubs: [{
    type: Schema.Types.ObjectId,
    unique: true,
    ref: 'Hub'
  }],
  viewedAt: {
    type: Date,
    required: true,
    default: Date.now
  }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

module.exports = mongoose.model('SubscriptionUserToHub', subscriptionUserToHubSchema)
