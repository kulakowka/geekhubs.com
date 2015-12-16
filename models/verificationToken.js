'use strict'

var uuid = require('node-uuid')

var mongoose = require('../config/mongoose')

var Schema = mongoose.Schema

var verificationTokenSchema = Schema({
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
    expires: '4h'
  }
})

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

verificationTokenSchema.static('verifyUser', function verifyUser (token, done) {
  this
  .findOne({token: token})
  .populate('user')
  .exec()
  .catch(done)
  .then(doc => {
    var user = doc.user
    user.emailConfirmed = true
    user.save(err => {
      if (err) return done(err)
      done()
    })
  })
})

module.exports = mongoose.model('VerificationToken', verificationTokenSchema)
