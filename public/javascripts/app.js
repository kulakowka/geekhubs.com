/* global $ */

$(document)
  .on('submit', 'form', submitForm)
  .on('click', '.list .js-loadMore', loadMore)
  .on('click', '.js-show-replies', loadReplies)

function loadReplies () {
  if (!ajaxEnabled()) return true

  var link = $(this)
  var url = link.attr('href')
  var item = link.closest('article')
  var replies = item.next('.replies')

  $.get(url).done(function(html){
    if (replies.length) {
      replies.remove()
    } else {
      item.after(html)  
    }
  }).fail(function(){
    console.log('fail', arguments)
  })

  return false
}

// helper for ajax option
function ajaxEnabled () {
  return $('input[name="ajax"]').is(':checked')
}

// load more callback
function loadMore () {
  if (!ajaxEnabled()) return true

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

// submit form callback
function submitForm () {
  if (!ajaxEnabled()) return true

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
