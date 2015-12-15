/* global confirm */

var $ = require('jquery')

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
  var data = $(this).serialize()
  $.post('/auth/signin', data, function (json) {
    if (json.user) document.location.href = '/'// + json.user.username
  }, 'json')
  return false
}

function signup () {
  var data = $(this).serialize()
  $.post('/auth/signup', data, function (json) {
    if (json.user) document.location.href = '/auth/signup/success'
  }, 'json')
  return false
}

function userUpdate () {
  var data = $(this).serialize()
  $.post('/settings', data, function (json) {
    if (json.user) document.location.href = '/users/' + json.user.username
  }, 'json')
  return false
}

function userDestroy () {
  if (!confirm('Are you sure?')) return
  var data = $(this).serialize()
  $.post('/auth/destroy', data, function (json) {
    if (json.user) document.location.href = '/'// + json.user.username
  }, 'json')
  return false
}
