const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const hbs  = require('hbs');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const Page = require('./routes/page');
const Api = require('./routes/api');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerHelper('raw', function(options){
	return options.fn(this);
});

// MongoDB database setup
const client = new MongoClient('mongodb://localhost:27017');
let db = {};
client.connect(function(err) {
	assert.equal(null, err);
	console.log("Connected successfully to server");
	
	db = client.db('close-to-home');
	
	client.close();
});

const router = express.Router();
const pageRouter = new Page(router,db);
const apiRouter = new Api(router,db);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', pageRouter);
app.use('/api', apiRouter);

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

module.exports = app;
