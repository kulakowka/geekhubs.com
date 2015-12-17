
var $ = require('jquery')

// This is need for mobile browsers without :hover effect
module.exports.onHandleClick = function onHandleClick (event) {
  var handle = $(this)
  var dropdown = handle.closest('.dropdown')

  dropdown.addClass('open')

  $(document).one('click', function () {
    dropdown.removeClass('open')
  })

  return false
}
