var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../app/models/user');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });


    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    passport.use('local-signup', new LocalStrategy(
      {

        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {


        process.nextTick(function() {

        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser = new User();

                // set the user's data
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);
                newUser.local.firstName = req.body.firstName;
                newUser.local.lastName = req.body.lastName;
                newUser.local.PhoneNumber = req.body.phoneNumber;
                newUser.local.onListServe = req.body.listServe;
                newUser.local.isAdmin = false;
                newUser.local.level = 0;


                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

        });

    }));


        passport.use('local-login', new LocalStrategy({

        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {


        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'The email/password combination is incorrect'));

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'The email/password combination is incorrect'));

            // all is well, return successful user
            return done(null, user);
        });

    }));

};
