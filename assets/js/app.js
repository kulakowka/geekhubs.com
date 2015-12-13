// TODO: Надо сделать несколько разных файлов. Один глобальный. 
// А еще один - для авторизованных пользователей. Который будем подключать только на некоторых страницах.

var $ = require('jquery')
var article = require('./handlers/article')
var tag = require('./handlers/tag')
var autosize = require('autosize')
var selectize = require('selectize')

// from a jQuery collection
autosize($('textarea'))

$('select').selectize({
    create: false
})

$(document)
  .on('keyup', '.articleForm input[name="title"]', article.onTitleKeyup)
  .on('keyup', '.tagForm input[name="title"]', tag.onTitleKeyup)
  .on('click', '.articleForm .tabs .tab', article.onTabClick)