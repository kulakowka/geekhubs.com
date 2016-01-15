'use strict'

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || 'sandboxa2fa6aec1054486ba188ee59ad0fcdbd.mailgun.org'
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || 'key-2fea16609fb8a7434a05e84a4c480ac1'

var mailgun = require('mailgun-js')({
  apiKey: MAILGUN_API_KEY,
  domain: MAILGUN_DOMAIN
})

module.exports = mailgun

/**
 * Functions for working with API Mailgun
 * It sends a message to a specified address
 */
module.exports.mailgunSend = function mailgunSend (data, done) {
  mailgun.messages().send(data, (err, body) => {
    if (err) return done(err)
    done()
  })
}
