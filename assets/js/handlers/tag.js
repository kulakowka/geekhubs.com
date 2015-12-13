var slug = require('limax')
var $ = require('jquery')

module.exports.onTitleKeyup = function (event) {
  var input = $(this)
  var form = input.closest('form')
  var slugInput = form.find('input[name="slug"]')
  
  var title = input.val()

  slugInput.val(slug(title))
}

