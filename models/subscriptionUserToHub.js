'use strict'

var mongoose = require('../config/mongoose')

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
    ref: 'Hub' 
  }],
  viewedAt: {
    type: Date,
    required: true,
    default: Date.now
  }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

// Tag methods for articles

// subscriptionUserToHubSchema.statics.updateArticlesCount = function (tags) {
//   return this.find({_id: { $in: tags }}, (err, tags) => {
//     tags.forEach(tag => tag.updateArticlesCount())
//   })
// }

// subscriptionUserToHubSchema.methods.updateArticlesCount = function () {
//   let tag = this
  
//   this.model('Article').count({ tags: { $in: [this._id] } }, (err, count) => {
//     if (err) return console.log('Error', err)

//     tag.articlesCount = count
//     tag.save(err => {
//       if (err) return console.log('Error', err)
//     })
//   })
// }

module.exports = mongoose.model('SubscriptionUserToHub', subscriptionUserToHubSchema)


