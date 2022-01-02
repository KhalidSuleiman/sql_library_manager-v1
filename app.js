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


app.use((req, res, next) => {
  const err = new Error('Sorry.. The page you\'re looking for can\'t be found');
  err.status = 404;
  console.log(err);
  console.log(err.status);
  next(err);
});


app.use(async (err, req, res, next) => {
  
  console.log('Global error');
  
  if (err.status === 404) {
    res.status(404).render('page-not-found', { err });
  } else {
    console.log("------"+err.status+"-------")
    err.status = 500;
    console.log("------"+err.status+"----2---")
    console.log('Global error else statement ')
    if(!err.message){
      err.message = `something went wrong on the server.`;
      console.log("--message---for-500---"+err.message+"-------")
    }else {
    console.log("---1---")
    console.log(err.message)
    console.log("---2---")

    res.status(err.status || 500)
    console.log("---3---")
    console.log(res.status);
    console.log("---4---")
    
    }
    await res.status(500).render('error', { err });
  }
});

module.exports = app;
