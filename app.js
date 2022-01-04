var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'library.db'
});

const models = require("./models");

const db = require('./models');
const Book = db.models;
const { Op } = db.Sequelize;

// first to run to check the availability of database 
(async () => {
  await models.sequelize.sync();
  try {
    await models.sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// 404 error catcher 
app.use((req, res, next) => {
  const err = new Error('Sorry.. The page you\'re looking for can\'t be found');
  err.status = 404;
  console.log(err);
  console.log(err.status);
  next(err);
});

// global error handler 
app.use((err, req,res,next) => {
  if(err){
    console.log('Global error Handler called');
    console.log(err.message);
    console.log(err.status)
  }
  
  if(err.status === 404){
    return res.status(404).render('page-not-found',{err});
  }
  err.message = err.message || 'Oops! It looks like something went wrong on the server.';
  res.status(err.status || 500).render('error',{err});
  
})


module.exports = app;
