var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');

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
var multerConfig = getMulterConfig(); //TODO bad HACK - 

var auth    = (process.env.AUTH || false);

// Various pseudo services
var services = require('./server/server.js');
app.get('/api/services/slicer/:stlfile', restrict, multipartMiddleware, services.Slicer);
app.get('/api/services/slicer/', restrict, multipartMiddleware, services.Slicer);

//app.post('/api/services/upload/',multer(multerConfig).single('photo'), services.UploadSTL);
app.post('/api/services/upload/', services.UploadSTL);

var multer = require('multer');
var upload = multer(getMulterConfig());
//app.post('/api/services/upload', restrict, multipartMiddleware,);
app.post('/myfileupload/', upload.single('file'), services.UploadSTL);


// Microservices

app.get('/ms/services/suppliers/material/:material', restrict, multipartMiddleware, services.getSuppliers);
app.get('/ms/services/supplier/:supplier/partcost/number/:number/model/:model/material/:material', restrict, multipartMiddleware, services.quoteForModel);

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
// for file uplaoding
function getMulterConfig (){

  const multerConfig = {
  //https://medium.com/@Moonstrasse/how-to-make-a-basic-html-form-file-upload-using-multer-in-an-express-node-js-app-16dac2476610
  storage: multer.diskStorage({
   //Setup where the user's file will go
   destination: function(req, file, next){
     next(null, './public/stlfilestorage');
     },   
      
      //Then give the file a unique name
      filename: function(req, file, next){
          console.log(file);
          const ext = file.mimetype.split('/')[1];
          next(null, file.fieldname + '-' + Date.now() + '.'+ext);
        }
      }),   
      
      //A means of ensuring only images are uploaded. 
      fileFilter: function(req, file, next){
            if(!file){
              next();
            }
          const image = true;//file.mimetype.startsWith('image/');
          if(image){
            console.log('photo uploaded');
            next(null, true);
          }else{
            console.log("file not supported");
            
            //TODO:  A better message response to user on failure.
            return next();
          }
      }
    };

    return multerConfig;
  }

module.exports = app;
