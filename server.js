
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var Subgroup  = require('./app/models/subgroup');


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


//This code is for the Cron Like Job scheduling to pull from the Facebook API
// var schedule = require('node-schedule');
// var j = schedule.scheduleJob('* * * * * *', function(){
//
//
//
//
// });
// console.log(schedule);

//allows for http requests
var request = require('request');

//imports the eventStream model
var eventStream = require('./app/models/eventStream');

var insertIntoDB = function(json)
{

	var arrLength = json.data.length;
	for(var i = 0; i < arrLength; i++)
	{
			//wrote it like this so we don't worry about the index being asynchronous
			(function(index){
				eventStream.findOne({'facebookEventId' : json.data[index].id}, function(err, dbEvent){

					if(err)
					{
						console.log(err);
						return;
					}

					if(!dbEvent)
					{
						//creates event.
						var event = new eventStream();
						event.description = json.data[index].description;
						event.name =	json.data[index].name;
						event.place.name =	json.data[index].place.name;
						event.starttime =	json.data[index].start_time;
						event.facebookEventId = json.data[index].id;

						//saves event
						event.save();
					}
					else
					{
						dbEvent.description = json.data[index].description;
						dbEvent.name =	json.data[index].name;
						dbEvent.place.name =	json.data[index].place.name;
						dbEvent.starttime =	json.data[index].start_time;
						dbEvent.facebookEventId = json.data[index].id;
						dbEvent.save();
					}

				});
			})(i);

	}
}

// var token = 'EAACEdEose0cBANPy4Qy9EA8FTZBTarpv1MCUqJIzsLc3Q85g9LxAEjWqdIqEjRQfSn9xZBayecL7tqX6y8rIdeMxCd4p3YTscx35RAgruwuuTJMQwe2io0FnaNMYzvQx0MRz1JJouajjvwmfggBP8xu5ZA3V5n9Kblx9OQFYwZDZD';
// request( ('https://graph.facebook.com/v2.6/494011427297346/events?access_token=' + token), function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//     // console.log(body)
// 		// console.log(response.data);
// 		// console.log(response);
// 		var json = JSON.parse(body);
// 		insertIntoDB(json);
//   }
// 	//display the error for the API
// 	else
// 	{
// 		console.log('response: \n');
// 		console.log(response);
// 		console.log('error: ' + error);
// 	}
// })

