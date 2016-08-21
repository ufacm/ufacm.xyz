'use strict';
const events  = require('../models/eventStream');

const eventsOutput = (req, res, next) => {
  events.find({}, (err, eventStream) => {
    if (err)
    {
      res.send(500);
    } else {
      res.send(eventStream);
    }
  });
};

module.exports = eventsOutput;
