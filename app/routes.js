'use strict';

// const multer = require('multer');
const fs = require('fs');
const cors = require('cors');

// const Grid = require('gridfs-stream');
const auth = require('http-auth');
const formidable = require('formidable');
const cpy = require('cpy');
const fsaccess = require('fs-access');

// const util = require('util');

const Subgroup = require('./models/subgroup');
const User = require('./models/user');
const lesson = require('../config/lessons.js');
const settingsMiddleWare = require('./middleware/settings.middleware.js');
const pullEventsMiddleWare = require('./middleware/pullEventsGivenAToken.js');
const pullSECEventsFromfb = require('./middleware/pullSECEventFromfb.js');
const eventsAPI = require('./middleware/eventsAPI.js');
const secEvents = require('./middleware/secEvents');

// const zip = require('express-zip');

module.exports = (app, passport, mongoose) => {

    // setup resume repo password for Companies Only
    const basic = auth.basic({
        realm: 'Sponsoring companies only.',
        file: __dirname + '/users.htpasswd'
      });

    // get the page for all student repo's
    app.get('/repo', auth.connect(basic), (req, res) => {
        res.render('resume/repo.ejs', {
            user: req.user
          });
      });

    // render the index page
    app.get('/', (req, res) => {

        res.render('index.ejs', {
            user: req.user
          });
      });

    // render the UFPT page
    app.get('/ufpt', (req, res) => {

        res.render('ufpt.ejs', {
            user: req.user
          });
      });

    // app.post('/testpdf', (req, res) => {
    //     let pdfs = [];
    //
    //     for (let i = 0; i < req.body.pdfs.length; i++) {
    //       let str = req.body.pdfs[i].slice(24, req.body.pdfs[i].length);
    //       pdfs.push({
    //               path: 'localStorage/pdfs/' + req.body.pdfs[i],
    //               name: str
    //             });
    //
    //       // pdfs.push(req.body.pdfs[i]);
    //     }
    //
    //     console.log(pdfs);
    //     res.send('asdf');
    //   });

    // mass download PDFs but this is still not secure
    // app.get('/downloadPDF', (req, res) => {
    //     res.zip(pdfs);
    //   });

    app.get('/feed', (req, res) => {
        res.render('feed.ejs');
      });

    app.get('/contact', (req, res) => {
        res.render('contact.ejs', {
            user: req.user
          });
      });

    app.get('/resume', isLoggedIn, (req, res) => {
        res.render('resume/profile_resume.ejs', {
            user: req.user
          });
      });

    app.get('/contactus', (req, res) => {
        res.render('contactus/contactus.ejs', {
            user: req.user
          });
      });

    app.get('/events', (req, res) => {
        res.render('events.ejs', {
            user: req.user
          });
      });

    app.get('/ufpt', (req, res) => {
        res.render('ufpt.ejs');
      });

    app.get('/login', (req, res) => {
        res.render('login.ejs', {
            message: req.flash('loginMessage')
          });
      });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
      }));

    // route for receiving resumeRepo form
    app.post('/updateResume', isLoggedIn, (req, res) => {
        let form = new formidable.IncomingForm();

        // take in data
        form.parse(req, (err, fields, files) => {

          if (err) {
            return res.send(500);
          }

          // save the essential questions and resume.
          // query the database for the user
          User.findOne({ _id: req.user._id }, (err, user) => {

            if (err) {
              return res.send(500);
            }

            // if we actually uploaded a file
            if (files.pdfFile.size !== 0) {

              // save it locally
              let linkName = (user._id + '_' + user.local.firstName + '_' + user.local.lastName + '.pdf');
              let linkPath = (__dirname + '/../localStorage/pdfs');
              cpy([files.pdfFile.path], linkPath,
                {
                  rename: linkName
                }
              ).then(() => {

                // save the link in the db
                user.local.resumeLink = linkPath + '/' + linkName;
                user.save();

              });
            }

            // save the essential questions
            user.local.question1 = fields.question1.trim();
            user.local.question2 = fields.question2.trim();
            user.local.question3 = fields.question3.trim();

            user.save();

            // bump them back to profile
            res.render('profile/profile.ejs', {
              user: user
            });
          });
        });

        form.on('error', (err) => {
          console.log('form uploading error');
          return res.send(500);
        });

      });

    // route to pull file for preview
    app.get('/file', isLoggedIn, (req, res) => {

        const resumePath = req.user.local.resumeLink;

        // if we have access, send it over
        fsaccess(resumePath, (err) => {
          if (err) {
            console.log('err:', err);
            return res.json('Error reading file, please contact webmaster!');
          }

          res.set('Content-Type', 'application/pdf');
          fs.createReadStream(resumePath).pipe(res);
        });
      });

    // app.get('/clicks/:link', (req, res) => {
    //
    //     const picId = req.params.link;
    //
    //     // gfs.files.find({
    //     //     filename: picId
    //     //   }).toArray((err, files) => {
    //     //     if (err) {
    //     //       res.json(err);
    //     //     }
    //     //
    //     //     if (files.length > 0) {
    //     //       let mime = 'application/pdf';
    //     //       res.set('Content-Type', mime);
    //     //       let readStream = gfs.createReadStream({
    //     //           filename: picId
    //     //         });
    //     //       readStream.pipe(res);
    //     //     } else {
    //     //       res.json('File Not Found');
    //     //     }
    //     //   });
    //   });

    app.get('/signup', (req, res) => {
        res.render('signup/signup.ejs', {
            message: req.flash('signupMessage')
          });
      });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
      }));

    // Checks for profile.ejs in the profile directory folder
    app.get('/profile', isLoggedIn, (req, res) => {
        res.render('profile/profile.ejs', {
            user: req.user
          });
      });

    // Checks for profile.ejs in the profile directory folder
    app.get('/code', isLoggedIn, (req, res) => {
        res.render('code_tuts/code.ejs', {
            user: req.user
          });
      });

    app.get('/getStudentResumes', (req, res) => {
        if (Object.keys(req.body)[0] === null) {
          User.find({}, (err, users) => {
              res.send(users);
            });
        } else {
          User.find({
              'local.tags': Object.keys(req.body)[0]
            }, (err, users) => {
              res.send(users);
            });
        }
      });

    app.get('/update', isLoggedIn, (req, res) => {

        Subgroup.find({
            name: req.query.name
          }, (err, subgroup) => {
            if (err) {
              throw err;
            }

            subgroup.members.push(req.user._id);

          });

      });

    app.get('/up', (req, res) => {

        req.user.local.level = req.user.local.level + 1;
        req.user.save((err) => {
            res.send(lesson[req.user.local.level]);
          });

      });

    // Checks for changepassword.ejs in the changepassword directory folder
    app.get('/changePassword', isLoggedIn, (req, res) => {
        res.render('changePassword/changePassword.ejs', {
            user: req.user
          });
      });

    app.post('/changePassword', isLoggedIn, settingsMiddleWare.changePassword);

    // Checks for settings.ejs in the settings directory folder
    app.get('/settings', isLoggedIn, (req, res) => {
        res.render('settings/settings.ejs', {
            user: req.user
          });
      });

    app.get('/eventStream', cors(), eventsAPI);

    // Sec event specific routes
    app.get('/secEvents', cors(), secEvents);

    // used when a user goes to the setting's page and updates information
    app.post('/settings', isLoggedIn, settingsMiddleWare.updateUser);

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
      });

    app.get('/adminPageForStaffOnly', isAdmin, (req, res, next) => {
        res.render('adminPageForStaffOnly/admin.ejs', {
          user: req.user
        });
      });

    app.post('/pullEventsFromFb', isAdmin, pullEventsMiddleWare);

    app.post('/pullSECEventsFronFb', isAdmin, pullSECEventsFromfb);
  };

// route middleware to make sure
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }

  // if they aren't redirect them to the home page
  res.redirect('/');
}

// boilerplate check to see if user is admin
function isAdmin(req, res, next) {

  if (req.isAuthenticated() && req.user.local.isAdmin) {
    return next();
  }

  res.redirect('/');
}
