'use strict'

module.exports = function getForbiddenError () {
  var error = new Error('You don\'t have permission for this')
  error.status = 403
  return error
}
