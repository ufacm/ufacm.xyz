'use strict';

const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');

let userSchema = mongoose.Schema({

    local: {
        email: String,
        password: String,
        firstName: String,
        lastName: String,
        PhoneNumber: String,
        onListServe: Boolean,
        isAdmin: Boolean,
        resumeLink: String,
        level: Number,
        question1: String,
        question2: String,
        question3: String,
        tags: [String]
      }
  });

// Changed thesed both to regular functions because of scoping issues.
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
  };

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
