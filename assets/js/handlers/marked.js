var $ = require('jquery')
var marked = require('marked')
// var hljs = require('highlight.js/lib/highlight')

// hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'))
// hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'))
// hljs.registerLanguage('coffeescript', require('highlight.js/lib/languages/coffeescript'))
// hljs.registerLanguage('cpp', require('highlight.js/lib/languages/cpp'))
// hljs.registerLanguage('cs', require('highlight.js/lib/languages/cs'))
// hljs.registerLanguage('css', require('highlight.js/lib/languages/css'))
// hljs.registerLanguage('d', require('highlight.js/lib/languages/d'))
// hljs.registerLanguage('markdown', require('highlight.js/lib/languages/markdown'))
// hljs.registerLanguage('dart', require('highlight.js/lib/languages/dart'))
// hljs.registerLanguage('delphi', require('highlight.js/lib/languages/delphi'))
// hljs.registerLanguage('django', require('highlight.js/lib/languages/django'))
// hljs.registerLanguage('dns', require('highlight.js/lib/languages/dns'))
// hljs.registerLanguage('dockerfile', require('highlight.js/lib/languages/dockerfile'))
// hljs.registerLanguage('dos', require('highlight.js/lib/languages/dos'))
// hljs.registerLanguage('dts', require('highlight.js/lib/languages/dts'))
// hljs.registerLanguage('dust', require('highlight.js/lib/languages/dust'))
// hljs.registerLanguage('elixir', require('highlight.js/lib/languages/elixir'))
// hljs.registerLanguage('elm', require('highlight.js/lib/languages/elm'))
// hljs.registerLanguage('ruby', require('highlight.js/lib/languages/ruby'))
// hljs.registerLanguage('erb', require('highlight.js/lib/languages/erb'))
// hljs.registerLanguage('erlang-repl', require('highlight.js/lib/languages/erlang-repl'))
// hljs.registerLanguage('erlang', require('highlight.js/lib/languages/erlang'))
// hljs.registerLanguage('fix', require('highlight.js/lib/languages/fix'))
// hljs.registerLanguage('fsharp', require('highlight.js/lib/languages/fsharp'))
// hljs.registerLanguage('go', require('highlight.js/lib/languages/go'))
// hljs.registerLanguage('golo', require('highlight.js/lib/languages/golo'))
// hljs.registerLanguage('haml', require('highlight.js/lib/languages/haml'))
// hljs.registerLanguage('handlebars', require('highlight.js/lib/languages/handlebars'))
// hljs.registerLanguage('haskell', require('highlight.js/lib/languages/haskell'))
// hljs.registerLanguage('http', require('highlight.js/lib/languages/http'))
// hljs.registerLanguage('ini', require('highlight.js/lib/languages/ini'))
// hljs.registerLanguage('java', require('highlight.js/lib/languages/java'))
// hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'))
// hljs.registerLanguage('json', require('highlight.js/lib/languages/json'))
// hljs.registerLanguage('lasso', require('highlight.js/lib/languages/lasso'))
// hljs.registerLanguage('less', require('highlight.js/lib/languages/less'))
// hljs.registerLanguage('lisp', require('highlight.js/lib/languages/lisp'))
// hljs.registerLanguage('livescript', require('highlight.js/lib/languages/livescript'))
// hljs.registerLanguage('lua', require('highlight.js/lib/languages/lua'))
// hljs.registerLanguage('makefile', require('highlight.js/lib/languages/makefile'))
// hljs.registerLanguage('matlab', require('highlight.js/lib/languages/matlab'))
// hljs.registerLanguage('mercury', require('highlight.js/lib/languages/mercury'))
// hljs.registerLanguage('perl', require('highlight.js/lib/languages/perl'))
// hljs.registerLanguage('nginx', require('highlight.js/lib/languages/nginx'))
// hljs.registerLanguage('nix', require('highlight.js/lib/languages/nix'))
// hljs.registerLanguage('nsis', require('highlight.js/lib/languages/nsis'))
// hljs.registerLanguage('objectivec', require('highlight.js/lib/languages/objectivec'))
// hljs.registerLanguage('oxygene', require('highlight.js/lib/languages/oxygene'))
// hljs.registerLanguage('parser3', require('highlight.js/lib/languages/parser3'))
// hljs.registerLanguage('php', require('highlight.js/lib/languages/php'))
// hljs.registerLanguage('powershell', require('highlight.js/lib/languages/powershell'))
// hljs.registerLanguage('processing', require('highlight.js/lib/languages/processing'))
// hljs.registerLanguage('profile', require('highlight.js/lib/languages/profile'))
// hljs.registerLanguage('puppet', require('highlight.js/lib/languages/puppet'))
// hljs.registerLanguage('python', require('highlight.js/lib/languages/python'))
// hljs.registerLanguage('q', require('highlight.js/lib/languages/q'))
// hljs.registerLanguage('r', require('highlight.js/lib/languages/r'))
// hljs.registerLanguage('rib', require('highlight.js/lib/languages/rib'))
// hljs.registerLanguage('roboconf', require('highlight.js/lib/languages/roboconf'))
// hljs.registerLanguage('rust', require('highlight.js/lib/languages/rust'))
// hljs.registerLanguage('scala', require('highlight.js/lib/languages/scala'))
// hljs.registerLanguage('scheme', require('highlight.js/lib/languages/scheme'))
// hljs.registerLanguage('scilab', require('highlight.js/lib/languages/scilab'))
// hljs.registerLanguage('scss', require('highlight.js/lib/languages/scss'))
// hljs.registerLanguage('smalltalk', require('highlight.js/lib/languages/smalltalk'))
// hljs.registerLanguage('sql', require('highlight.js/lib/languages/sql'))
// hljs.registerLanguage('stylus', require('highlight.js/lib/languages/stylus'))
// hljs.registerLanguage('swift', require('highlight.js/lib/languages/swift'))
// hljs.registerLanguage('tcl', require('highlight.js/lib/languages/tcl'))
// hljs.registerLanguage('tex', require('highlight.js/lib/languages/tex'))
// hljs.registerLanguage('thrift', require('highlight.js/lib/languages/thrift'))
// hljs.registerLanguage('tp', require('highlight.js/lib/languages/tp'))
// hljs.registerLanguage('twig', require('highlight.js/lib/languages/twig'))
// hljs.registerLanguage('typescript', require('highlight.js/lib/languages/typescript'))
// hljs.registerLanguage('vbnet', require('highlight.js/lib/languages/vbnet'))
// hljs.registerLanguage('vbscript', require('highlight.js/lib/languages/vbscript'))
// hljs.registerLanguage('vbscript-html', require('highlight.js/lib/languages/vbscript-html'))
// hljs.registerLanguage('verilog', require('highlight.js/lib/languages/verilog'))
// hljs.registerLanguage('vhdl', require('highlight.js/lib/languages/vhdl'))
// hljs.registerLanguage('vim', require('highlight.js/lib/languages/vim'))
// hljs.registerLanguage('xl', require('highlight.js/lib/languages/xl'))
// hljs.registerLanguage('xquery', require('highlight.js/lib/languages/xquery'))
// hljs.registerLanguage('yaml', require('highlight.js/lib/languages/yaml'))

marked.setOptions({
  gfm: true,
  tables: false,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
  // highlight: function (code, lang, callback) {
  //   return hljs.highlightAuto(code).value
  // }
})

module.exports.onTabClick = function (event) {
  var tab = $(this)
  var frame = tab.attr('data-frame')
  var form = tab.closest('form')
  var tabs = form.find('.tabs .tab')
  var frames = form.find('.frame')
  var content = form.find('textarea[name="content"]')
  var preview = form.find('.preview')

  frames.removeClass('open')
  form.find('.' + frame).addClass('open')

  tabs.removeClass('active')
  tab.addClass('active')

  var previewHtml = marked(content.val())

  preview.html(previewHtml || 'Nothing to preview')

  if (frame === 'write') content.focus()

  return false
}

module.exports.onFocus = function (event) {
  var textarea = $(this)
  var field = textarea.closest('.field')
  var tab = field.find('.tab.active')
  tab.addClass('focus')
}

module.exports.onBlur = function (event) {
  var textarea = $(this)
  var field = textarea.closest('.field')
  var tab = field.find('.tab.focus')
  tab.removeClass('focus')
}
