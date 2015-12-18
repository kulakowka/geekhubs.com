/* global confirm */

var $ = require('jquery')

var onAjaxError = require('./errors').onAjaxError

module.exports.logout = logout
module.exports.signin = signin
module.exports.signup = signup
module.exports.userUpdate = userUpdate
module.exports.userDestroy = userDestroy

function logout () {
  $.post('/auth/logout', function () {
    document.location.href = '/'
  }, 'json')
  return false
}

function signin () {
  var form = $(this)
  var data = form.serialize()
  var url = '/auth/signin'
  var buttons = form.find('button[type="submit"]')

  buttons.prop('disabled', true).addClass('loading')

  $.post(url, data, 'json').done(function (json) {
    if (json.user) document.location.href = '/'
  }).fail(function (res) {
    buttons.prop('disabled', false).removeClass('loading')
    onAjaxError(res.responseJSON)
  })
  return false
}

function signup () {
  var form = $(this)
  var data = form.serialize()
  var url = '/auth/signup'
  var buttons = form.find('button[type="submit"]')

  buttons.prop('disabled', true).addClass('loading')

  $.post(url, data, 'json').done(function (json) {
    if (json.user) document.location.href = '/auth/signup/success'
  }).fail(function (res) {
    buttons.prop('disabled', false).removeClass('loading')
    onAjaxError(res.responseJSON)
  })
  return false
}

function userUpdate () {
  var form = $(this)
  var data = form.serialize()
  var url = '/settings'
  var buttons = form.find('button[type="submit"]')

  buttons.prop('disabled', true).addClass('loading')

  $.post(url, data, 'json').done(function (json) {
    if (json.user) document.location.href = '/users/' + json.user.username
  }).fail(function (res) {
    buttons.prop('disabled', false).removeClass('loading')
    onAjaxError(res.responseJSON)
  })
  return false
}

function userDestroy () {
  if (!confirm('Are you sure?')) return
  var form = $(this)
  var data = form.serialize()
  var url = '/auth/destroy'
  var buttons = form.find('button[type="submit"]')

  buttons.prop('disabled', true).addClass('loading')

  $.post(url, data, 'json').done(function (json) {
    if (json.user) document.location.href = '/'// + json.user.username
  }).fail(function (res) {
    buttons.prop('disabled', false).removeClass('loading')
    onAjaxError(res.responseJSON)
  })
  return false
}
