'use strict'

var colors = require('colors')

module.exports = function report (err, results) {
  if (err) console.log('Seeds result ERROR:', err)

  console.log('\nCreate Users...'.blue)
  results.users.forEach(user => console.log('- %s'.green, user.username, user._id))

  console.log('\nCreate Hubs...'.blue)
  results.hubs.forEach(hub => console.log('- %s'.green, hub.title, hub._id))

  console.log('\nCreate Articles...'.blue)
  results.articles.forEach(article => console.log('- %s'.green, article.title, article._id))

  console.log('\nCreate Comments...'.blue)
  results.comments.forEach(comment => console.log('- %s'.green, comment.content, comment._id))

  console.log('\nTotal:'.blue)
  console.log('Users:', colors.green(results.users.length))
  console.log('Hubs:', colors.green(results.hubs.length))
  console.log('Articles:', colors.green(results.articles.length))
  console.log('Comments:', colors.green(results.comments.length))
  console.log('\nClose connection.\n'.red)
}
