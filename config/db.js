var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/app2', function() {
  mongoose.connection.db.dropDatabase(function(err, result) {
    new Item({content: '1 root comment', parentId: 'root'}).save(function(error, item) {
      ['1.1'].map((content, index) => {
        new Item({content: content, parentId: item._id}).save((err, childItem) => {
          // if (index) return

          // item.parentId = childItem._id
          // item.save()
        })
      })
    })
  });  
});


var Schema = mongoose.Schema

var itemSchema = new Schema({ 
  repliesCount: {
    type: Number,
    required: true,
    default: 0
  },
  parentId: {
    type: String,
    required: true,
    default: 'root'
  },
  createdAt: { 
    type: Date, 
    required: true,
    default: Date.now 
  },
  // дата последнего ответа на этот комментарий
  repliedAt: { 
    type: Date
  },
  content: String 
});

// Хук вызывается перед сохранением документа
itemSchema.pre('save', function (next) {
  // необходимо пометить документ как "был новым только что", 
  // чтобы потом в post колбеке можно было проверить это
  // Подробнее о проблеме: 
  // https://github.com/Automattic/mongoose/issues/1474
  // https://github.com/Automattic/mongoose/issues/2162#issuecomment-75620378
  this.wasNew = this.isNew
  next()
})

// Хук вызывается после сохранения документа
itemSchema.post('save', function (item) {
  if (item.parentId === 'root') return; 
  if (!item.wasNew) return;

  getPerent(item, (err, parent) => {
    getRepliesCount(parent, (err, count) => {
      parent.repliesCount = count
      parent.repliedAt = item.createdAt
      parent.save()
    })
  })
})

var Item = mongoose.model('Item', itemSchema);

module.exports.mongoose = mongoose
module.exports.Item = Item

// получить коммент родитель
function getPerent (item, callback) {
  Item
  .findById(item.parentId)
  .exec(callback)
}

// получить кол-во ответов на коммент
function getRepliesCount (item, callback) {
  Item
  .count({parentId: item._id})
  .exec(callback)
}

