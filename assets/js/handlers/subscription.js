'use strict'

var $ = require('jquery')

var onAjaxError = require('./errors').onAjaxError

module.exports.onFormSubmit = function onFormSubmit (event) {
  var form = $(this)
  var url = '/subscription'
  var data = form.serialize()
  var buttons = form.find('button[type="submit"]')
  var successSubscriptionForm = $('.successSubscriptionForm')

  buttons.prop('disabled', true).addClass('loading')

  $.post(url, data, 'json').done(function (json) {
    successSubscriptionForm.removeClass('hidden')
    form.addClass('hidden')
  }).fail(function (res) {
    buttons.prop('disabled', false).removeClass('loading')
    onAjaxError(res.responseJSON)
  })

  return false
}
