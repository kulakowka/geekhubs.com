var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/app2', function() {
  // Drop the current database
  // mongoose.connection.db.dropDatabase(function(err, result) {
  //   console.log('DB dropped')
  // });  
});



var Item = mongoose.model('Item', { 
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  content: String 
});

module.exports.mongoose = mongoose
module.exports.Item = Item

