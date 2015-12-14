var $ = require('jquery')

module.exports.onFormSubmit = function onFormSubmit (event) {
  var form = $(this)
  var content = form.find('textarea[name="content"]')
  var data = form.serialize()
  var commentsList = $('.commentsList')

  $.post('/comments', data).done(function(html) {
    commentsList.append(html)
  }).fail(function(html) {
    console.log('error')
  })

  form.trigger('reset')

  return false
}