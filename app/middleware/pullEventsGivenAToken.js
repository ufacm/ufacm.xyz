'use strict';
/*jshint loopfunc: true */
const request = require('request');
const EventStream = require('../models/eventStream');
const _ = require('lodash');

const insertIntoDB = (json, insertIntoDBCallBack) =>
{

  let arrLength = json.data.length;
  for (let index = 0; index < arrLength; index++) {

    EventStream.findOne({ facebookEventId: json.data[index].id }, (err, dbEvent) => {

          if (err) {
            return insertIntoDBCallBack(err);
          }

          if (!dbEvent) {

            let event = new EventStream();

            if (!_.isUndefined(json.data[index].description)) {
              event.description = json.data[index].description;
            }

            if (!_.isUndefined(json.data[index].name)) {
              event.name =	json.data[index].name;
            }

            if (!_.isUndefined(json.data[index].place)) {
              event.place.name =	json.data[index].place.name;
            }

            if (!_.isUndefined(json.data[index].start_time)) {
              event.starttime =	json.data[index].start_time;
            }

            event.facebookEventId = json.data[index].id;

            // saves event
            event.save();
          } else {

            if (!_.isUndefined(json.data[index].description)) {
              dbEvent.description = json.data[index].description;
            }

            if (!_.isUndefined(json.data[index].name)) {
              dbEvent.name =	json.data[index].name;
            }

            if (!_.isUndefined(json.data[index].place)) {
              dbEvent.place.name =	json.data[index].place.name;
            }

            if (!_.isUndefined(json.data[index].start_time)) {
              dbEvent.starttime =	json.data[index].start_time;
            }

            dbEvent.facebookEventId = json.data[index].id;
            dbEvent.save();
          }

        });
  }

  insertIntoDBCallBack();
};

const pullEvents = (req, res) => {

  console.log(req.body.facebookToken);

  let token = req.body.facebookToken;
  request(('https://graph.facebook.com/v2.6/494011427297346/events?access_token=' + token),  (error, response, body) => {
    if (!error && response.statusCode == 200) {

      console.log('Facebook events received, now processing');
      let json = JSON.parse(body);

      insertIntoDB(json, (err) => {
        if (err) {
          res.send(500);
        }

        res.send(200);

      });
    } else {
      console.log('response: \n');
      console.log('error: ' + error);
      res.send(400);
    }
  });

};

module.exports = pullEvents;
