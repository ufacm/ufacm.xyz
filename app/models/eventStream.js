'use strict';
const mongoose = require('mongoose');

const eventStreamScheme = mongoose.Schema(
  {
    description: String,
    name: String,
    place: {
        name: String
      },
    starttime: Date,
    facebookEventId: String     // primary key
  });

// create the model for users and expose it to our app
module.exports = mongoose.model('event', eventStreamScheme);
