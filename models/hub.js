'use strict'

var mongoose = require('../config/mongoose')

// var Article = require('./article')
var User = require('./user')
//var Comment = require('./comment')

var Schema = mongoose.Schema

var hubSchema = new Schema({ 
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
    required: true,
    index: true,
    unique: true,
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
  // meta information
  articlesCount: {
    type: Number,
    required: true,
    //index: true,
    default: 0
  },

}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

// Hub methods for articles

hubSchema.statics.updateArticlesCount = function (hubs) {
  return this.find({_id: { $in: hubs }}, (err, hubs) => {
    hubs.forEach(hub => hub.updateArticlesCount())
  })
}

hubSchema.methods.updateArticlesCount = function () {
  let hub = this
  
  this.model('Article').count({ hubs: { $in: [this._id] } }, (err, count) => {
    if (err) return console.log('Error', err)

    hub.articlesCount = count
    hub.save(err => {
      if (err) return console.log('Error', err)
    })
  })
}

hubSchema.pre('save', function (next) {
  this.wasNew = this.isNew
  next()
})

// Хук вызывается после сохранения документа
hubSchema.post('save', function (hub) {
  if (!hub.wasNew) return

  User.updateHubsCount(hub.creator, (err) => {
    console.log('Error', err)
  })
})

module.exports = mongoose.model('Hub', hubSchema)


