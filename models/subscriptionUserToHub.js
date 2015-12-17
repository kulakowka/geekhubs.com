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
  hub: {
    type: Schema.Types.ObjectId,
    ref: 'Hub',
    index: true,
    required: true
  }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

module.exports = mongoose.model('SubscriptionUserToHub', subscriptionUserToHubSchema)
