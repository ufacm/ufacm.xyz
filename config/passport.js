'use strict';

const LocalStrategy = require('passport-local').Strategy;

// load up the user model
const User = require('../app/models/user');

module.exports = (passport) => {

    passport.serializeUser((user, done) => {
        done(null, user.id);
      });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
          });
      });

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
          },
        (req, email, password, done) => {

            process.nextTick(() => {

                User.findOne({
                    'local.email': email
                  }, (err, user) => {
                    // if there are any errors, return the error
                    if (err) {
                      return done(err);
                    }

                    // check to see if theres already a user with that email
                    if (user) {
                      return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                      // if there is no user with that email
                      // create the user
                      let newUser = new User();

                      // set the user's data
                      newUser.local.email = email;
                      newUser.local.password = newUser.generateHash(password);
                      newUser.local.firstName = req.body.firstName;
                      newUser.local.lastName = req.body.lastName;
                      newUser.local.PhoneNumber = req.body.phoneNumber;
                      newUser.local.onListServe = req.body.listServe;
                      newUser.local.isAdmin = false;
                      newUser.local.level = 0;
                      newUser.local.question1 = '';
                      newUser.local.question2 = '';
                      newUser.local.question3 = '';

                      // save the user
                      newUser.save((err) => {
                          if (err) {
                            throw err;
                          }

                          return done(null, newUser);
                        });
                    }

                  });

              });

          }));

    passport.use('local-login', new LocalStrategy({

            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
          },
        (req, email, password, done) => {

            User.findOne({
                'local.email': email
              }, (err, user) => {

                // if there are any errors, return the error before anything else
                if (err) {
                  return done(err);
                }

                // if no user is found, return the message
                if (!user) {
                  return done(null, false, req.flash('loginMessage', 'The email/password combination is incorrect'));
                }

                // if the user is found but the password is wrong
                if (!user.validPassword(password)) {
                  return done(null, false, req.flash('loginMessage', 'The email/password combination is incorrect'));
                }

                // all is well, return successful user
                return done(null, user);
              });

          }));

  };
