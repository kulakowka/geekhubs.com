'use strict'

var mongoose = require('mongoose')
require('mongoose-paginater')

mongoose.connect('mongodb://localhost/geekhub', function () {
  console.log('Mongo connected')
})

module.exports = mongoose
