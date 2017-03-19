'use strict';

const mongoose = require('mongoose');

let safeTextValidator = {
  validator: function(v) {
    return /^[a-zA-Z0-9-_ @.]*$/.test(v);
  },
  message: 'Invalid characters used.'
};

const userSchema = mongoose.Schema({
  regDate: {
    type: Date,
    default: Date.now
  },
  verified: {
    type: Boolean,
    default: false
  },
  username: {
    type: String
  },
  password: {
    type: String
  },
  email: {
    type: String,
    min: [3, 'Please enter a valid email address'],
    required: [true, 'Please provide your email address'],
    validate: safeTextValidator
  },
  teacherEmail: {
    type: String,
    min: [3, 'Please enter a valid email address'],
    required: [true, 'Please provide your teacher\'s email address'],
    validate: safeTextValidator
  },
  schoolName: {
    type: String,
    min: [3, 'Please enter a valid school name'],
    required: [true, 'Please provide your school\'s name'],
    validate: safeTextValidator
  },
  schoolType: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: [true, 'Please provide your first name'],
    validate: safeTextValidator
  },
  lastName: {
    type: String,
    required: [true, 'Please provide your last name'],
    validate: safeTextValidator
  }
});

// create the model for users and expose it to our app
module.exports = userSchema;
