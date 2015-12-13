var $ = require('jquery')
var article = require('./handlers/article')
var tag = require('./handlers/tag')
var autosize = require('autosize')


// from a jQuery collection
autosize($('textarea'));

$(document)
  .on('keyup', '.articleForm input[name="title"]', article.onTitleKeyup)
  .on('keyup', '.tagForm input[name="title"]', tag.onTitleKeyup)
  .on('click', '.articleForm .tabs .tab', article.onTabClick)