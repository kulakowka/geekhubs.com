'use strict'

var mongoose = require('../config/mongoose')

var Comment = require('./comment')

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
    //index: true,
    trim: true,
    lowercase: true,
    unique: true
  },
  emailConfirmed: {
    type: Boolean
  },
  password: {
    type: String,
    required: true
  },

  // meta information
  articlesCount: {
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


// User methods for articles

userSchema.methods.getArticlesCount = function (cb) {
  return this.model('Article').count({ user: this._id }, cb);
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

var User = mongoose.model('User', userSchema)

module.exports = User


