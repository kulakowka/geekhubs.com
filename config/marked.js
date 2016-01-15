'use strict'

const marked = require('marked')
const highlightjs = require('highlight.js')

marked.setOptions({
  // renderer: new marked.Renderer(),
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

module.exports = marked
