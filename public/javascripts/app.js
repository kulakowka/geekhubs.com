/* global $, autosize */

$(document)
  .on('click', '.list .js-loadMore', loadMore)
  .on('click', '.js-show-replies', loadReplies)
  .on('keydown', '.commentForm textarea', submitFormOnKeyUp)
  .on('submit', '.commentForm', submitForm)



// from a jQuery collection
autosize($('textarea'))

function loadReplies () {
  var link = $(this)
  var url = link.attr('href')
  var item = link.closest('article')
  var replies = item.next('.replies')

  $.get(url).done(function (html) {
    if (replies.length) {
      replies.remove()
    } else {
      item.after(html)
      autosize(item.next('.replies').find('textarea'))
    }
  }).fail(function () {
    console.log('fail', arguments)
  })

  return false
}

// load more callback
function loadMore () {
  var link = $(this)
  var list = link.closest('.list')
  var url = link.attr('href')

  link.remove()

  $.get(url).done(function (html) {
    list.append(html)
  }).fail(function () {
    console.log('fail', arguments)
  })

  return false
}

function submitFormOnKeyUp (event) {
  if (!(event.keyCode === 13 && !event.shiftKey)) return true
  
  $(this).closest('form').trigger('submit')

  return false
}
// submit form callback
function submitForm (event) {  
  var form = $(this)
  var list = form.next('.list')
  var action = form.attr('action')
  var data = form.serialize()

  $.post(action, data).done(function (html) {
    list.prepend(html)
    form.trigger('reset')
  }).fail(function () {
    console.log('fail', arguments)
  })

  return false
}
