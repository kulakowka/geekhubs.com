var $ = require('jquery')

module.exports.onSubscribeClick = function onFormSubmit (event) {
  var button = $(this)
  var url = button.attr('data-url')
  var subscriptionBtn = button.closest('.subscriptionBtn')
  
  subscriptionBtn.addClass('subscribed')

  $.post(url).done(function(json) {
    
  }).fail(function(json) {
    console.log('error')
  })

  return false
}

module.exports.onUnsubscribeClick = function onFormSubmit (event) {
  var button = $(this)
  var url = button.attr('data-url')
  var subscriptionBtn = button.closest('.subscriptionBtn')

  subscriptionBtn.removeClass('subscribed')

  $.post(url).done(function(json) {
    
  }).fail(function(json) {
    console.log('error')
  })

  return false
}

