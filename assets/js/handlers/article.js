var slug = require('limax')
var $ = require('jquery')
var marked = require('marked')
var highlightjs = require('highlight.js')

marked.setOptions({
  gfm: true,
  tables: false,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  highlight: function (code, lang, callback) {
    return highlightjs.highlightAuto(code).value
  }
})

module.exports.onTitleKeyup = function (event) {
  var input = $(this)
  var form = input.closest('form')
  var slugInput = form.find('input[name="slug"]')
  
  var title = input.val()

  slugInput.val(slug(title))
}

module.exports.onTabClick = function (event) {
  var tab = $(this)
  var frame = tab.attr('data-frame')
  var form = tab.closest('form')
  var tabs = form.find('.tabs .tab')
  var frames = form.find('.frame')
  var content = form.find('textarea[name="content"]')
  var preview = form.find('.preview')

  frames.removeClass('open')
  form.find('.'+frame).addClass('open')

  tabs.removeClass('active')
  tab.addClass('active')

  var previewHtml = marked(content.val())

  preview.html(previewHtml || 'Nothing to preview')

  return false
}