'use strict'

var mongoose = require('../config/mongoose')
var seedUsers = require('./users')
var colors = require('colors')
var users = require('./users/data')

mongoose.connection.once('open', function () {
  console.log('Mongo connection opened'.green)

  mongoose.connection.db.dropDatabase(function(err) { 
   if (err) return console.log(err)
  
    console.log('DB dropped'.red)

    console.log('Create users'.green)

    seedUsers(users, function(err, createdUsers) {
      if (err) return console.log(err)

      createdUsers.forEach(user => console.log('user created'.blue, user.username))

      process.exit(0)
    })
  })
})
