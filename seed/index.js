'use strict'

var mongoose = require('../config/mongoose')
var seedUsers = require('./users')
var seedHubs = require('./hubs')
var colors = require('colors')

mongoose.connection.once('open', function () {
  console.log('Mongo connection opened'.green)

  mongoose.connection.db.dropDatabase(function(err) { 
   if (err) return console.log(err)
  
    console.log('DB dropped'.red)

    console.log('Create users'.green)

    seedUsers(function(err, createdUsers) {
      if (err) return console.log(err)

      createdUsers.forEach(user => console.log('User created'.blue, user.username))

      console.log('Create hubs for users'.green)
      seedHubs(createdUsers, function (err, createdHubs) {
        if (err) return console.log(err)

        createdHubs.forEach(hub => console.log('Hub created'.blue, hub.title))
        process.exit(0)
      })
      
    })
  })
})
