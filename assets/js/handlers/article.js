'use strict'

var $ = require('jquery')

var onAjaxError = require('./errors').onAjaxError

module.exports.onFormSubmit = function onFormSubmit (event) {
  var form = $(this)
  var url = form.attr('action')
  var data = form.serialize()
  var buttons = form.find('button[type="submit"]')

  buttons.prop('disabled', true).addClass('loading')

  $.post(url, data, 'json').done(function (json) {
    document.location.href = '/articles/' + json.article._id + '/' + json.article.slug
  }).fail(function (res) {
    buttons.prop('disabled', false).removeClass('loading')
    onAjaxError(res.responseJSON)
  })

  return false
}
