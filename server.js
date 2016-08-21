'use strict';

const express  = require('express');
const app      = express();
const port     = process.env.PORT || 8080;
const mongoose = require('mongoose');
const passport = require('passport');
const flash    = require('connect-flash');

const configDB = require('./config/database.js');

// const Subgroup  = require('./app/models/subgroup');
// const request = require('request');
// const EventStream = require('./app/models/eventStream');

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

  // required for passport
  app.use(express.session({ secret: 'architrocks' }));
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(flash());
});

require('./app/routes.js')(app, passport, mongoose);

app.listen(port);
console.log('The magic happens on port ' + port);

// This code is for the Cron Like Job scheduling to pull from the Facebook API
// var schedule = require('node-schedule');
// var j = schedule.scheduleJob('* * * * * *', function(){
//
//
//
//
// });
// console.log(schedule);

// const insertIntoDB = (json) =>
// {
//
//   let arrLength = json.data.length;
//   for (var i = 0; i < arrLength; i++)
//   {
//     // wrote it like this so we don't worry about the index being asynchronous
//     ((index) => {
//       eventStream.findOne({ facebookEventId: json.data[index].id }, (err, dbEvent) => {
//
//         if (err) {
//           console.log(err);
//           return;
//         }
//
//         if (!dbEvent) {
//           // creates event.
//           let event = new EventStream();
//           event.description = json.data[index].description;
//           event.name =	json.data[index].name;
//           event.place.name =	json.data[index].place.name;
//           event.starttime =	json.data[index].start_time;
//           event.facebookEventId = json.data[index].id;
//
//           // saves event
//           event.save();
//         } else {
//           dbEvent.description = json.data[index].description;
//           dbEvent.name =	json.data[index].name;
//           dbEvent.place.name =	json.data[index].place.name;
//           dbEvent.starttime =	json.data[index].start_time;
//           dbEvent.facebookEventId = json.data[index].id;
//           dbEvent.save();
//         }
//
//       });
//     })(i);
//
//   }
// };
