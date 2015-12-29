// TODO: Надо сделать несколько разных файлов. Один глобальный. 
// А еще один - для авторизованных пользователей. Который будем подключать только на некоторых страницах.

var $ = require('jquery')
var autosize = require('autosize')
var attachFastClick = require('fastclick')
require('selectize')

// from a jQuery collection
autosize($('textarea'))

// Selectize
$('select[name="hubs"]').selectize({
  create: false,
  maxItems: 3
})

// Fast click
attachFastClick(document.body)

// Handlers
var marked = require('./handlers/marked')
var comment = require('./handlers/comment')
var article = require('./handlers/article')
var hub = require('./handlers/hub')
var subscription = require('./handlers/subscription')
var auth = require('./handlers/auth')
var dropdown = require('./handlers/dropdown')

$(document)

  // dropdown
  .on('click', '.dropdown .handle', dropdown.onHandleClick)

  // marked
  .on('click', '.commentForm .tabs .tab', marked.onTabClick)
  .on('click', '.articleForm .tabs .tab', marked.onTabClick)

  // active tab in focus
  .on('focus', '.articleForm textarea[name="content"]', marked.onFocus)
  .on('blur', '.articleForm textarea[name="content"]', marked.onBlur)
  .on('focus', '.commentForm textarea[name="content"]', marked.onFocus)
  .on('blur', '.commentForm textarea[name="content"]', marked.onBlur)

  // hubs
  .on('click', '.js-hub-subscribe', hub.onSubscribeClick)
  .on('click', '.js-hub-unsubscribe', hub.onUnsubscribeClick)

  // comments
  .on('submit', '.commentForm', comment.onFormSubmit)

  // articles
  .on('submit', '.articleForm', article.onFormSubmit)

  // sidebar: subscription
  .on('submit', '.subscriptionForm', subscription.onFormSubmit)

  // users
  .on('click', '.js-button-logout', auth.logout)
  .on('submit', '.js-form-signin', auth.signin)
  .on('submit', '.js-form-signup', auth.signup)
  .on('submit', '.js-form-user-update', auth.userUpdate)
  .on('submit', '.js-form-user-destroy', auth.userDestroy)
