'use strict'

var colors = require('colors')

module.exports = function report (err, results) {
  if (err) console.log('Seeds result ERROR:', err)

  console.log('\nCreate Users...'.blue)
  results.users.forEach(user => console.log('- %s'.green, user.username))

  console.log('\nCreate Hubs...'.blue)
  results.hubs.forEach(hub => console.log('- %s'.green, hub.title))

  console.log('\nCreate Articles...'.blue)
  results.articles.forEach(article => console.log('- %s'.green, article.title))

  console.log('\nCreate Comments...'.blue)
  results.comments.forEach(comment => console.log('- %s'.green, comment.content))

  console.log('\nCreate Subscriptions...'.blue)
  results.subscriptions.forEach(subscription => console.log('- user(%s) > hub(%s)'.green, subscription.creator, subscription.hub))

  console.log('\nTotal:'.blue)
  console.log('Users:', colors.green(results.users.length))
  console.log('Hubs:', colors.green(results.hubs.length))
  console.log('Articles:', colors.green(results.articles.length))
  console.log('Comments:', colors.green(results.comments.length))
  console.log('Subscriptions:', colors.green(results.subscriptions.length))
  console.log('\nClose connection. Press Ctrl + C to finish.\n'.red)
}
