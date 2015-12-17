'use strict'

var $ = require('jquery')

module.exports.onFormSubmit = function onFormSubmit (event) {
  var form = $(this)
  var writeTab = form.find('.tab[data-frame="write"]')
  var data = form.serialize()
  var commentsList = $('.commentsList')

  $.post('/comments', data).done(function (html) {
    commentsList.append(html)
  }).fail(function (html) {
    console.log('error')
  })

  form.trigger('reset')
  writeTab.click()

  return false
}
