'use strict';

const mongoose = require('mongoose');

const teacherSchema = mongoose.Schema({
  email: {
    type: String,
    min: [3, 'Please enter a valid email address'],
    required: [true, 'Please provide your teacher\'s email address'],
  },
  schoolName: {
    type: String,
    min: [3, 'Please enter a valid school name'],
    required: [true, 'Please provide your school\'s name'],
  },
  schoolType: {
    type: String,
    required: true
  },
  code: {
    type: String,
    default: "password",
    required: true
  }
});

// create the model for users and expose it to our app
module.exports = teacherSchema;
