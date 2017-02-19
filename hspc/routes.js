'use strict';

const express  = require('express');
const router   = express.Router();
const session  = require('express-session');
const flash    = require('connect-flash');

// connect to our MongoDB database and load our model
const db = require('mongoose').createConnection('mongodb://cal:asdfasdf@ds017246.mlab.com:17246/acmlocaldb');
const userSchema = require('./models/user.js');
const User = db.model('ContestUser', userSchema);

// session library required to use flash for displaying alerts
router.use(session({
  secret: 'ufhspc$ecret',
  resave: true,
  saveUninitialized: true
}));
router.use(flash());

// register a new user
router.post('/register', function(req, res) {

  let newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    teacherEmail: req.body.teacherEmail,
    schoolName: req.body.schoolName,
    schoolType: req.body.schoolType
  });

  newUser.save(function (err) {
    let template = {
      firstName: '',
      lastName: '',
      email: '',
      teacherEmail: '',
      schoolName: '',
      errorMessage: '',
      success: '',
      firstNameError: '',
      lastNameError: '',
      emailError: '',
      teacherEmailError: '',
      schoolNameError: '',
      schoolTypeError: ''
    };

    if (err) {
      req.flash('errorMessage', 'Please fill out all form fields.'),
      req.flash('firstName', req.body.firstName);
      req.flash('lastName', req.body.lastName);
      req.flash('email', req.body.email);
      req.flash('teacherEmail',req.body.teacherEmail);
      req.flash('schoolName', req.body.schoolName);
      req.flash('schoolType', req.body.schoolType);

      for (let error in err.errors) {
        let target = err.errors[error].path;
        if (template[target + 'Error'] == '') {
          req.flash(target + 'Error', 'has-error');
        }
      }
      //req.flash('errorMessage',errors[0]);
      res.redirect(301, '/hspc/register');
    }
    else {
      console.log('Success')
      //req.flash('success', 'True');
      req.flash('success', 'success');
      res.redirect(301, '/hspc/register');
    }
  });
});

// display registration page and any alerts
router.get('/register', function(req, res) {
  res.render('hspc/register', {
      firstName: req.flash('firstName'),
      lastName: req.flash('lastName'),
      email: req.flash('email'),
      teacherEmail: req.flash('teacherEmail'),
      schoolName: req.flash('schoolName'),
      errorMessage: req.flash('errorMessage'),
      success: req.flash('success'),
      firstNameError: req.flash('firstNameError'),
      lastNameError: req.flash('lastNameError'),
      emailError: req.flash('emailError'),
      teacherEmailError: req.flash('teacherEmailError'),
      schoolNameError: req.flash('schoolNameError'),
      schoolTypeError: req.flash('schoolTypeError')
    });
});

// route for index
router.get('/', function(req, res) {
  res.render('hspc/index', {});
});

// route for faq
router.get('/faq', function(req, res) {
  res.render('hspc/faq', {});
});

// set up routes for static files
router.use('/', express.static(__dirname + '/static'));

module.exports = router;
