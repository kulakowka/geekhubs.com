var $ = require('jquery')

module.exports.onSubscribeClick = function onFormSubmit (event) {
  var button = $(this)
  var hubId = button.attr('data-hub')
  var subscriptionBtn = button.closest('.subscriptionBtn')

  subscriptionBtn.addClass('subscribed')

  $.post('/subscription/hub/' + hubId + '/create').done(function (json) {
    console.log('done', json)
  }).fail(function (json) {
    console.log('error')
  })

  return false
}

module.exports.onUnsubscribeClick = function onFormSubmit (event) {
  var button = $(this)
  var hubId = button.attr('data-hub')
  var subscriptionBtn = button.closest('.subscriptionBtn')

  subscriptionBtn.removeClass('subscribed')

  $.post('/subscription/hub/' + hubId + '/remove').done(function (json) {
    console.log('done', json)
  }).fail(function (json) {
    console.log('error')
  })

  return false
}

