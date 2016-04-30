
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var configDB = require('./config/database.js');


mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.use(express.static(__dirname + '/views'));

app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); 
	app.use(express.cookieParser()); 
	app.use(express.bodyParser()); 

	app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	app.use(express.session({ secret: 'architrocks' })); 
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); 
});

require('./app/routes.js')(app, passport); 

app.listen(port);
console.log('The magic happens on port ' + port);
