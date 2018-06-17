var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var multipart     = require('connect-multiparty');

console.log("in express");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, './client'));
app.set('client', path.join(__dirname, './client'));

app.use('/', indexRouter);
app.use('/index', indexRouter);
app.use('/users', usersRouter);

var mainform = require('./server/mainform.js');
app.get('/mainform/', mainform.setupMainForm);

var multipartMiddleware = multipart();

//globals

var auth    = (process.env.AUTH || false);

// Various pseudo services
var services = require('./server/server.js');
app.get('/api/services/slicer', restrict, multipartMiddleware, services.Slicer);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * Restriction middleware function.
 */
function restrict(req, res, next) {
  if (auth) {
    if (req.session.user) {
      next();
    } else {
      req.session.error = 'Access denied!';
      // Unauthorized.
      res.redirect(401, '/login');
    }
  } else {
    next();
  }
}

module.exports = app;
