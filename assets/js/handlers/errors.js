'use strict'

/* global alert */

module.exports.onAjaxError = function onAjaxError (json) {
  // TODO: create error handlers
  console.log('AJAX ERROR', json)
  alert('AJAX ERROR: ' + json.error)
}
