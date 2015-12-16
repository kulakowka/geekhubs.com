// TODO: Надо сделать несколько разных файлов. Один глобальный. 
// А еще один - для авторизованных пользователей. Который будем подключать только на некоторых страницах.

var $ = require('jquery')
var autosize = require('autosize')
var selectize = require('selectize')
var attachFastClick = require('fastclick')

// from a jQuery collection
autosize($('textarea'))

// Selectize
$('select[name="hubs"]').selectize({
  create: false,
  maxItems: 10
})

// Fast click
attachFastClick(document.body)


// Handlers
var marked = require('./handlers/marked')
var comment = require('./handlers/comment')
var hub = require('./handlers/hub')
var auth = require('./handlers/auth')

$(document)

  // marked
  .on('click', '.commentForm .tabs .tab', marked.onTabClick)
  .on('click', '.articleForm .tabs .tab', marked.onTabClick)

  // hubs
  .on('click', '.js-hub-subscribe', hub.onSubscribeClick)
  .on('click', '.js-hub-unsubscribe', hub.onUnsubscribeClick)

  // comments
  .on('submit', '.commentForm', comment.onFormSubmit)

  // users
  .on('click', '.js-button-logout', auth.logout)
  .on('submit', '.js-form-signin', auth.signin)
  .on('submit', '.js-form-signup', auth.signup)
  .on('submit', '.js-form-user-update', auth.userUpdate)
  .on('submit', '.js-form-user-destroy', auth.userDestroy)
