'use strict';

const express  = require('express');
const app      = express();
const port     = process.env.PORT || 1488;
const mongoose = require('mongoose');
const passport = require('passport');
const flash    = require('connect-flash');
const serveIndex = require('serve-index');

const logger   = require('morgan');
const cookieParser = require('cookie-parser');
const session  = require('express-session');
const bodyParser = require('body-parser');

const configDB = require('./config/database.js');

// const Subgroup  = require('./app/models/subgroup');

mongoose.connect(configDB.url); // connect to our database
mongoose.connection.on('error', console.error.bind(console, 'ACM Site MongoDB connection error:'));

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(express.static(__dirname + '/views'));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating

// set up Josh's public directory for his ufptstuff
app.use('/ufpt/files', serveIndex('ufptstuff/', { icons: true }));
app.use('/ufpt/files/', express.static('ufptstuff/'));
app.use('/hspc/', require('./hspc/routes.js'));

// required for passport
app.use(session({
  secret: 'architrocks',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

require('./app/routes.js')(app, passport, mongoose);

app.listen(port);
console.log('The magic happens on port ' + port);
