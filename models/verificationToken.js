'use strict'

// Packages
var uuid = require('node-uuid')

// Configs
var mongoose = require('../config/mongoose')

// VerificationTokenSchema schema
var Schema = mongoose.Schema
var schema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: 'User'
  },
  token: {
    type: String,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: '4h'         // Verification token expires after 4 hours
  }
})

// Instance methods (verificationToken.createVerificationToken)
schema.methods.createVerificationToken = function (callback) {
  let token = uuid.v4()
  this.set('token', token)
  return this.save((err) => {
    if (err) return callback(err)
    callback(null, token)
  })
}

schema.static('verifyUser', function verifyUser (token, callback) {
  let selft = this
  return selft.findOne({token: token}).exec((err, verificationToken) => {
    if (err) return callback(err)
    if (!verificationToken) return callback(new Error('Token not found'))

    selft.model('User').findOneAndUpdate({_id: verificationToken.user}, {$set: {emailConfirmed: true}}, (err) => {
      if (err) return callback(err)
      callback()
    })
  })
})

module.exports = mongoose.model('VerificationToken', schema)
