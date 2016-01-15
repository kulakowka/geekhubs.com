'use strict'

const bodyParser = require('body-parser')
const browserify = require('browserify-middleware')
const cookieParser = require('cookie-parser')
const express = require('express')
const favicon = require('serve-favicon')
const helmet = require('helmet')
const i18n = require('i18n')
const logger = require('morgan')
const methodOverride = require('method-override')
const passport = require('passport')
const path = require('path')
const pmx = require('pmx')
const kue = require('kue')

pmx.init()

let app = express()

// minimal config
i18n.configure({
  defaultLocale: 'en',
  locales: ['en'],
  directory: __dirname + '/locales'
})

app.use(methodOverride('_method'))

app.use(helmet())

// init i18n module for this loop
app.use(i18n.init)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(require('./config/session'))
app.use(require('stylus').middleware(path.join(__dirname, 'public')))
app.use(require('./config/stylus'))
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'static')))
app.get('/js/app.js', browserify(path.join(__dirname, 'assets/js/app.js')))

// Passport.js
app.use(passport.initialize())
app.use(passport.session())

// view helpers
app.use(require('./config/viewHelpers'))

// Routes
app.use(require('./routes/sidebar'))
app.use('/', require('./routes/index'))
app.use('/articles', require('./routes/articles'))
app.use('/comments', require('./routes/comments'))
app.use('/hubs', require('./routes/hubs'))
app.use('/users', require('./routes/users'))
app.use('/auth', require('./routes/auth'))
app.use('/settings', require('./routes/settings'))
app.use('/subscription', require('./routes/subscription'))

// Mount kue JSON api
app.use('/admin/kue', require('./routes/policies/ifAdmin'), kue.app)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers
app.use((err, req, res, next) => {
  let error = app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: error
  })
})

module.exports = app
