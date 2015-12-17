'use strict'

module.exports = function getNotFoundError (message) {
  message = message || 'Page not found'
  var error = new Error(message)
  error.status = 404
  return error
}
