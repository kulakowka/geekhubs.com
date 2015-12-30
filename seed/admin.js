'use strict'

var User = require('../models/user')

// Settings
const admin = {
  username: 'admin',
  password: 'pass',
  isAdmin: true
}

User.create(admin, (err, user) => {
  if (err) return console.log(err)

  console.log('admin created', admin)
})
