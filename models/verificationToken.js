'use strict'

var uuid = require('node-uuid')

var mongoose = require('../config/mongoose')

var Schema = mongoose.Schema

var verificationTokenSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  token: {
    type: String,
    required: true
    // index: true
  }
}, { timestamps: { createdAt: 'createdAt' } })

verificationTokenSchema.methods.createVerificationToken = function (done) {
  var verificationToken = this
  var token = uuid.v4()
  verificationToken.set('token', token)
  verificationToken.save((err) => {
    if (err) return done(err)
    done(null, token)
    console.log('Verification token', verificationToken)
  })
}

var VerificationToken = mongoose.model('VerificationToken', verificationTokenSchema)

module.exports = VerificationToken