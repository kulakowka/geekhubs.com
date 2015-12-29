var marked = require('marked')
// var highlightjs = require('highlight.js')

marked.setOptions({
  gfm: true,
  tables: false,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  // highlight: function (code, lang, callback) {
  //   return highlightjs.highlightAuto(code).value
  // }
})

self.addEventListener('message', function(e) {
  var html = marked(e.data)
  self.postMessage(html)
}, false)