// TODO: Надо сделать несколько разных файлов. Один глобальный. 
// А еще один - для авторизованных пользователей. Который будем подключать только на некоторых страницах.

var $ = require('jquery')
var autosize = require('autosize')
var selectize = require('selectize')

var marked = require('./handlers/marked')
var slug = require('./handlers/slug')
var comment = require('./handlers/comment')

// from a jQuery collection
autosize($('textarea'))

$('select').selectize({
    create: false
})

$(document)
  .on('keyup', '.articleForm input[name="title"]', slug.onTitleKeyup)
  .on('keyup', '.tagForm input[name="title"]', slug.onTitleKeyup)

  .on('click', '.commentForm .tabs .tab', marked.onTabClick)
  .on('click', '.articleForm .tabs .tab', marked.onTabClick)

  .on('submit', '.commentForm', comment.onFormSubmit)