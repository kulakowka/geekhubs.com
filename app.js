var bodyParser = require('body-parser')
var browserify = require('browserify-middleware')
var cookieParser = require('cookie-parser')
var express = require('express')
var favicon = require('serve-favicon')
var helmet = require('helmet')
var i18n = require('i18n')
var logger = require('morgan')
var methodOverride = require('method-override')
var moment = require('moment')
var passport = require('passport')
var path = require('path')
var pmx = require('pmx')

pmx.init()

var app = express()

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

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('./config/session'))
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(require('./config/stylus'))
app.use(express.static(path.join(__dirname, 'public')));
app.get('/js/app.js', browserify(path.join(__dirname, 'assets/js/app.js')))

// Passport.js
app.use(passport.initialize())
app.use(passport.session())

// view helpers
app.use((req, res, next) => {
  res.locals.env = process.env.NODE_ENV
  res.locals.moment = moment
  res.locals.currentUser = req.user
  next()
})

// Routes
app.use('/', require('./routes/index'))
app.use('/articles', require('./routes/articles'))
app.use('/comments', require('./routes/comments'))
app.use('/hubs', require('./routes/hubs'))
app.use('/users', require('./routes/users'))
app.use('/auth', require('./routes/auth'))
app.use('/settings', require('./routes/settings'))
app.use('/subscription', require('./routes/subscription'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
