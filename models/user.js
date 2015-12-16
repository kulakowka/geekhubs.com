'use strict'

var bcrypt = require('bcrypt')

var mongoose = require('../config/mongoose')

// Models
//var Comment = require('./comment')
var VerificationToken = require('./verificationToken')
var SubscriptionUserToHub = require('./subscriptionUserToHub')
//var Hub = require('./hub')

// Services
var SendEmail = require('../services/emails/sendEmail')

// Mongoose plugins
var abilities = require('./plugins/abilities')
var deletedAt = require('./plugins/deletedAt')

var Schema = mongoose.Schema

var userSchema = new Schema({ 
  username: {
    type: String,
    index: true,
    trim: true,
    minlength: 3,
    maxlength: 40,
    required: true,
    lowercase: true,
    unique: true
  },
  email: {
    type: String,
    index: true,
    trim: true,
    lowercase: true,
    // unique: true
  },
  emailConfirmed: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true,
    select: false
  },

  // meta information
  articlesCount: {
    type: Number,
    required: true,
    //index: true,
    default: 0
  },
  hubsCount: {
    type: Number,
    required: true,
    //index: true,
    default: 0
  },
  commentsCount: {
    type: Number,
    required: true,
    //index: true,
    default: 0
  }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

// Assign plugins 
// User.plugin(createdAt, { index: true })
// User.plugin(updatedAt)
userSchema.plugin(deletedAt)
userSchema.plugin(abilities) // ACL

// User methods for articles
// 
userSchema.methods.comparePassword = function comparePassword (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, callback)
}

userSchema.methods.generateConfirmationToken = function generateConfirmationToken (callback) {
  var verificationToken = new VerificationToken({user: this._id})
  verificationToken.createVerificationToken(callback)
}

userSchema.methods.getArticlesCount = function (cb) {
  return this.model('Article').count({ creator: this._id }, cb);
}

userSchema.statics.updateArticlesCount = function (id, cb) {
  return this.findById(id, (err, user) => {
    if (err) return cb(err)

    user.getArticlesCount((err, count) => {
      if (err) return cb(err)

      user.articlesCount = count
      user.save(cb)
    })
  })
}

userSchema.methods.getHubsCount = function (cb) {
  return this.model('Hub').count({ creator: this._id }, cb);
}

userSchema.statics.updateHubsCount = function (id, cb) {
  return this.findById(id, (err, user) => {
    if (err) return cb(err)

    user.getHubsCount((err, count) => {
      if (err) return cb(err)

      user.hubsCount = count
      user.save(cb)
    })
  })
}

userSchema.methods.getCommentsCount = function (cb) {
  return this.model('Comment').count({ creator: this._id }, cb);
}

userSchema.statics.updateCommentsCount = function (id, cb) {
  return this.findById(id, (err, user) => {
    if (err) return cb(err)

    user.getCommentsCount((err, count) => {
      if (err) return cb(err)

      user.commentsCount = count
      user.save(cb)
    })
  })
}

// after cllabacks
userSchema.pre('save', function (next) {
  this.wasNew = this.isNew
  next()
})

userSchema.post('save', function(user) {
  if (!user.wasNew) return

  var subscription = new SubscriptionUserToHub({
    creator: user._id
  })

  subscription.save(err => {
    if (err) return console.log('Error:', err)
  })
})
userSchema.pre('save', function (next) {
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

userSchema.pre('save', function (next) {
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

module.exports = mongoose.model('User', userSchema)


