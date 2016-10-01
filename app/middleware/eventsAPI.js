'use strict';
const events  = require('../models/eventStream');

const eventsOutput = (req, res, next) => {
  events.find({}, (err, eventStream) => {
    if (err) {
      res.send(500);
    } else {

      // set lower bounds
      let lowerBounds = new Date();
      lowerBounds = new Date(lowerBounds.setDate(lowerBounds.getDate() - 1));

      // set upper bounds
      let upperBounds = new Date();
      upperBounds = new Date(upperBounds.setDate(upperBounds.getDate() + 28));

      let currentEvents = eventStream.filter((val) => {

          let eventDate = new Date(val.starttime);

          // logic checking
          // console.log('eventdate', eventDate.getTime());
          // console.log('lowerBounds', lowerBounds.getTime());
          // console.log('upperBounds', upperBounds.getTime());
          // console.log(eventDate.getTime() > lowerBounds.getTime());
          // console.log(eventDate.getTime() <= upperBounds.getTime());

          return (eventDate.getTime() >= lowerBounds.getTime() && eventDate.getTime() <= upperBounds.getTime());
        });

      res.send(currentEvents);
    }
  });
};

module.exports = eventsOutput;
