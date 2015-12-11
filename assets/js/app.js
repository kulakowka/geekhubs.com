var $ = require('jquery')
var article = require('./handlers/article')
var autosize = require('autosize')

// from a jQuery collection
autosize($('textarea'));

$(document)
  .on('keyup', '.articleForm input[name="title"]', article.onTitleKeyup)