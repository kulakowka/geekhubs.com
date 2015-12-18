'use strict'

var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/geekhub', function () {
  console.log('Mongo connected')
})

module.exports = mongoose
