'use strict';
/*jshint loopfunc: true */
const request = require('request');
const EventStream = require('../models/secEvent');

const insertIntoDB = (json, insertIntoDBCallBack) =>
{

  let arrLength = json.data.length;
  for (let index = 0; index < arrLength; index++) {

    EventStream.findOne({ facebookEventId: json.data[index].id }, (err, dbEvent) => {

          if (err) {
            return insertIntoDBCallBack(err);
          }

          if (!dbEvent) {

            // creates event.
            let event = new EventStream();
            event.description = json.data[index].description;
            event.name =	json.data[index].name;
            event.place.name =	json.data[index].place.name;
            event.starttime =	json.data[index].start_time;
            event.facebookEventId = json.data[index].id;

            // saves event
            event.save();
          } else {
            dbEvent.description = json.data[index].description;
            dbEvent.name =	json.data[index].name;
            dbEvent.place.name =	json.data[index].place.name;
            dbEvent.starttime =	json.data[index].start_time;
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
  request(('https://graph.facebook.com/v2.6/420010478012940/events?access_token=' + token),  (error, response, body) => {
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
