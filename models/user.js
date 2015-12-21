'use strict'

// Packages
var bcrypt = require('bcrypt')

// Configs
var mongoose = require('../config/mongoose')

// Models
var VerificationToken = require('./verificationToken')

// Services
var SendEmail = require('../services/emails/sendEmail')

// User schema
var Schema = mongoose.Schema
var schema = new Schema({
  username: {
    index: true,
    lowercase: true,
    maxlength: 40,
    minlength: 3,
    required: true,
    trim: true,
    type: String,
    unique: true
  },
  email: {
    index: true,
    lowercase: true,
    trim: true,
    type: String
  },
  emailConfirmed: {
    default: false,
    type: Boolean
  },
  isAdmin: {
    default: false,
    type: Boolean
  },
  subscribedToArticlesDigest: {
    default: false,
    type: Boolean
  },
  password: {
    required: true,
    select: false,
    type: String
  },
  articlesCount: {
    default: 0,
    required: true,
    type: Number
  },
  hubsCount: {
    default: 0,
    required: true,
    type: Number
  },
  commentsCount: {
    default: 0,
    required: true,
    type: Number
  }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

// Model plugins
schema.plugin(require('./plugins/deletedAt'))
schema.plugin(require('./plugins/abilities'))

// Instance methods (user.comparePassword)
schema.methods.comparePassword = function comparePassword (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, callback)
}

schema.methods.generateConfirmationToken = function generateConfirmationToken (callback) {
  var verificationToken = new VerificationToken({user: this._id})
  verificationToken.createVerificationToken(callback)
}

// Model static methods (User.updateArticlesCount(user._id))
schema.statics.updateArticlesCount = function (_id) {
  let self = this
  return self.model('Article').count({ creator: _id }, function (err, articlesCount) {
    if (err) return console.log(err)
    self.findOneAndUpdate({_id}, {$set: {articlesCount}}, (err) => {
      if (err) return console.log(err)
    })
  })
}

schema.statics.updateHubsCount = function (_id) {
  let self = this
  return self.model('Hub').count({ creator: _id }, function (err, hubsCount) {
    if (err) return console.log(err)
    self.findOneAndUpdate({_id}, {$set: {hubsCount}}, (err) => {
      if (err) return console.log(err)
    })
  })
}

schema.statics.incrementArticlesCount = function (_id) {
  return this.findOneAndUpdate({_id}, {$inc: {articlesCount: 1}}, function (err) {
    if (err) return console.log(err)
  })
}

schema.statics.incrementCommentsCount = function (_id) {
  return this.findOneAndUpdate({_id}, {$inc: {commentsCount: 1}}, function (err) {
    if (err) return console.log(err)
  })
}

schema.statics.incrementHubsCount = function (_id) {
  return this.findOneAndUpdate({_id}, {$inc: {hubsCount: 1}}, function (err) {
    if (err) return console.log(err)
  })
}

schema.statics.updateCommentsCount = function (_id) {
  let self = this
  return self.model('Comment').count({ creator: _id }, function (err, commentsCount) {
    if (err) return console.log(err)
    self.findOneAndUpdate({_id}, {$set: {commentsCount}}, (err) => {
      if (err) return console.log(err)
    })
  })
}

// Pre save hooks
schema.pre('save', function (next) {
  this.wasNew = this.isNew
  next()
})

schema.pre('save', function (next) {
  var user = this

  if (!user.isModified('password')) return next()

  bcrypt.genSalt((err, salt) => {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err)

      user.password = hash
      next()
    })
  })
})

schema.pre('save', function (next) {
  var user = this

  if (!user.isModified('email')) return next()

  user.emailConfirmed = false
  next()

  user.generateConfirmationToken((err, token) => {
    if (err) return next(err)
    SendEmail({
      title: 'Confirmation instructions',
      user: user,
      token: token,
      template: 'users/confirm-email'
    })
  })
})

module.exports = mongoose.model('User', schema)
