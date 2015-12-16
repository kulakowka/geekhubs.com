var $ = require('jquery')

module.exports.onSubscribeClick = function onFormSubmit (event) {
  var button = $(this)
  var url = button.attr('data-url')
  var subscriptionBtn = button.closest('.subscriptionBtn')
  
  $.post(url).done(function(json) {
    subscriptionBtn.addClass('subscribed')
  }).fail(function(json) {
    console.log('error')
  })

  return false
}

module.exports.onUnsubscribeClick = function onFormSubmit (event) {
  var button = $(this)
  var url = button.attr('data-url')
  var subscriptionBtn = button.closest('.subscriptionBtn')

  $.post(url).done(function(json) {
    subscriptionBtn.removeClass('subscribed')
  }).fail(function(json) {
    console.log('error')
  })

  return false
}

