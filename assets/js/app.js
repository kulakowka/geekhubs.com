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
var slug = require('./handlers/slug')
var comment = require('./handlers/comment')
var auth = require('./handlers/auth')

$(document)
  // slug
  .on('keyup', '.articleForm input[name="title"]', slug.onTitleKeyup)
  .on('keyup', '.hubForm input[name="title"]', slug.onTitleKeyup)

  // marked
  .on('click', '.commentForm .tabs .tab', marked.onTabClick)
  .on('click', '.articleForm .tabs .tab', marked.onTabClick)

  // comments
  .on('submit', '.commentForm', comment.onFormSubmit)

  // users
  .on('click', '.js-button-logout', auth.logout)
  .on('submit', '.js-form-signin', auth.signin)
  .on('submit', '.js-form-signup', auth.signup)
  .on('submit', '.js-form-user-update', auth.userUpdate)
  .on('submit', '.js-form-user-destroy', auth.userDestroy)
