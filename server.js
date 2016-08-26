'use strict';

const express  = require('express');
const app      = express();
const port     = process.env.PORT || 8080;
const mongoose = require('mongoose');
const passport = require('passport');
const flash    = require('connect-flash');
const serveIndex = require('serve-index');

const configDB = require('./config/database.js');

// const Subgroup  = require('./app/models/subgroup');

mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.use(express.static(__dirname + '/views'));

app.configure(() => {

  // set up our express application
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.json())
    .use(express.urlencoded());

  app.set('view engine', 'ejs'); // set up ejs for templating

  // set up Josh's public directory for his ufptstuff
  app.use('/ufpt/files', serveIndex('ufptstuff/', { icons: true }));
  app.use('/ufpt/files/', express.static('ufptstuff/'));

  // required for passport
  app.use(express.session({ secret: 'architrocks' }));
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(flash());

});

require('./app/routes.js')(app, passport, mongoose);

app.listen(port);
console.log('The magic happens on port ' + port);
