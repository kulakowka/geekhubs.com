var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/geekhub', function() {
  
  return;  // drop database and populate data?
  mongoose.connection.db.dropDatabase(function(err, result) { 
    console.log('DB dropped')
  })
})

module.exports = mongoose