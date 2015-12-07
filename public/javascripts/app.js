/* global $ */

$(document).on('submit', 'form', submitForm)
$(document).on('click', '#list .js-loadMore', loadMore)

// helper for ajax option
function ajaxEnabled () {
  return $('input[name="ajax"]').is(':checked')
}

// load more callback
function loadMore () {
  if (!ajaxEnabled()) return true

  var link = $(this)
  var list = link.closest('#list')
  var url = link.attr('href')

  link.remove()

  $.get(url).done(function (html) {
    list.append(html)
  }).fail(function () {
    console.log('fail', arguments)
  })

  return false
}

// submit form callback
function submitForm () {
  if (!ajaxEnabled()) return true

  var list = $('#list')
  var form = $(this)
  var action = form.attr('action')
  var data = form.serialize()

  $.post(action, data).done(function (html) {
    list.html(html)
    form.trigger('reset')
  }).fail(function () {
    console.log('fail', arguments)
  })

  return false
}
