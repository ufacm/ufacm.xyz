'use strict';

const express   = require('express');
const router    = express.Router();
const randtoken = require('rand-token')
const session   = require('express-session');
const flash     = require('connect-flash');
const moniker   = require('moniker');

const mailer = require('./mailer.js');

// connect to our MongoDB database and load our model
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = mongoose.createConnection(require('./config/database.js').url);
const userSchema = require('./models/user.js');
const teacherSchema = require('./models/teacher.js');
const User = db.model('ContestUser', userSchema);
const Teacher = db.model('Teacher', teacherSchema);

db.on('error', console.error.bind(console, 'HSPC Site MongoDB connection error:'));

// session library required to use flash for displaying alerts
router.use(session({
  secret: 'ufhspc$ecret',
  resave: true,
  saveUninitialized: true
}));
router.use(flash());

router.post('/unverify', function(req, res) {
  let code = req.body.v;
  let uid = req.body.uid;

  // Pull up the student's record
  User.findOne({_id: uid}, function(err, student) {
    if (err) {
      console.log(err);
      res.redirect(303, '/hspc');
      return;
    }

    let teacherEmail = student.teacherEmail;
    Teacher.findOne({email: teacherEmail}, function(err, teacher) {
      if (err) {
        console.log(err);
        res.redirect(303, '/hspc');
        return;
      }
      if (!teacher) {
        console.log('Teacher does not exist');
        res.redirect(303, '/hspc');
        return;
      }

      if (teacher.code == req.body.v) {
        console.log("Changing student")
        student.verified = false;
        student.save(function(err, student, rows) {
          res.redirect(303, '/hspc/verifyStudents?email='+teacherEmail+'&code='+req.body.v);
        });
      }
    });
  });
});

router.post('/verify', function(req, res) {
  let code = req.body.v;
  let uid = req.body.uid;

  // Pull up the student's record
  User.findOne({_id: uid}, function(err, student) {
    if (err) {
      console.log(err);
      res.redirect(303, '/hspc');
      return;
    }

    let teacherEmail = student.teacherEmail;
    Teacher.findOne({email: teacherEmail}, function(err, teacher) {
      if (err) {
        console.log(err);
        res.redirect(303, '/hspc');
        return;
      }
      if (!teacher) {
        console.log('Teacher does not exist');
        res.redirect(303, '/hspc');
        return;
      }

      if (teacher.code == req.body.v) {
        console.log("Changing student")
        student.verified = true;
        student.save(function(err, student, rows) {
          res.redirect(303, '/hspc/verifyStudents?email='+teacherEmail+'&code='+req.body.v);
		      mailer.contactStudent(student.email, student.username, student.password);
        });
      }
    });
  });
});

router.get('/verifyStudents', function(req, res) {
  let teacherEmail = req.query.email;
  let code = req.query.code;

  if (!code || !teacherEmail) {
    console.log("Teacher Found!");
    res.redirect(303, '/hspc');
    return
  }
  Teacher.findOne({ email: teacherEmail, code: code }, function (err, teacher) {
    if (!teacher) {
      console.log("Teacher Not Found!")
      res.redirect(303, '/hspc');
      return
    }
    console.log("Teacher Found!");
    User.find({ teacherEmail: teacherEmail, verified: true}, function (err, verifiedUsers) {
      if (err) {
        console.log(err);
        res.redirect(303, '/hspc');
        return
      }

      User.find({ teacherEmail: teacherEmail, $or: [{verified: false}, {verified: null}] }, function(err, nonverifiedUsers) {
        if (err) {
          console.log(err);
          res.redirect(303, '/hspc');
          return
        }

        res.render('hspc/verifyStudents', {
          validation: code,
          verifiedUsers: verifiedUsers,
          nonverifiedUsers: nonverifiedUsers
        });
      });
    });
  });
});


// register a new user
router.post('/register', function(req, res) {

  let newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    teacherEmail: req.body.teacherEmail.toLowerCase(),
    schoolName: req.body.schoolName,
    schoolType: req.body.schoolType,
    password: randtoken.generate(8),
    username: moniker.choose()
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
