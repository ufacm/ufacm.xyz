'use strict';

const multer = require('multer');
const fs = require('fs');
const Grid = require('gridfs-stream');
const request = require('request');
const auth = require('http-auth');

const Subgroup = require('./models/subgroup');
const User = require('./models/user');
const lesson = require('../config/lessons.js');
const settingsMiddleWare = require('./middleware/settings.middleware.js');
const eventsAPI = require('./middleware/eventsAPI.js');

// const zip = require('express-zip');

module.exports = (app, passport, mongoose) => {

    const basic = auth.basic({
        realm: 'Companies Only.',
        file: __dirname + '/users.htpasswd'
      });

    Grid.mongo = mongoose.mongo;
    const gfs = Grid(mongoose.connection.db);

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

    app.post('/testpdf', (req, res) => {
        let pdfs = [];

        for (let i = 0; i < req.body.pdfs.length; i++) {
          let str = req.body.pdfs[i].slice(24, req.body.pdfs[i].length);
          pdfs.push({
                  path: 'localStorage/pdfs/' + req.body.pdfs[i],
                  name: str
                });

          // pdfs.push(req.body.pdfs[i]);
        }

        console.log(pdfs);
        res.send('asdf');
      });

    // mass download PDFs but this is still not secure
    app.get('/downloadPDF', (req, res) => {
        res.zip(pdfs);
      });

    app.get('/feed', (req, res) => {
        res.render('feed.ejs');
      });

    app.post('/facebook', (req, res) => {
        let token = 'EAASBfsZBnMkUBAIWgtabr6IzPANJ8NE8027RaKYeG52P09iRDyoJZAPkeKQxPfq7ZBqHe3GehgyB3A7JOYi4LIX6U0fKoWTOcDZCKCfo9IJbRyBHWNVWaUA324Cw8p4kPdTBSoqzbNbT9RGYY2NqesDzWZC1jG7AZD';
        request(('https://graph.facebook.com/v2.6/494011427297346/events?access_token=' + token), (error, response, body) => {
            if (!error && response.statusCode == 200) {
              // console.log(body)
              // console.log(response.data);
              // console.log(response);
              let json = JSON.parse(body);
              res.send(json.data);

              // insertIntoDB(json);
            }

            // display the error for the API
            else {
              console.log('response: \n');
              console.log(response);
              console.log('error: ' + error);
            }
          });

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

    app.get('/repo', auth.connect(basic), (req, res) => {
        res.render('resume/repo.ejs', {
            user: req.user
          });
      });

    app.post('/updateProfile1', (req, res) => {

        req.user.local.question1 = Object.keys(req.body)[0];
        req.user.save();
      });

    app.post('/updateProfile2', (req, res) => {
        req.user.local.question2 = Object.keys(req.body)[0];
        req.user.save();
      });

    app.post('/updateProfile3', (req, res) => {
        req.user.local.question3 = Object.keys(req.body)[0];
        req.user.save();
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

    let storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '../pdfs/');
          },

        filename: (req, file, cb) => {
            cb(null, req.user._id + file.originalname);
          }
      });

    let uploading = multer({
        storage: storage
      });

    // let name = '';

    app.post('/resume/upload', uploading.array('pdfs', 10000), (req, res) => {

        // let dirname = require('path').dirname(__dirname);
        let filename = req.user._id + req.files[0].originalname;
        let path = req.files[0].path;

        // let type = req.files[0].mimetype;

        let readStream = fs.createReadStream(path);

        // let conn = req.conn;

        let writestream = gfs.createWriteStream({
            filename: filename
          });

        req.user.local.resumeLink = filename;
        req.user.save();
        readStream.pipe(writestream);
      });

    app.get('/file', (req, res) => {

        const picId = req.user.local.resumeLink;

        gfs.files.find({
            filename: picId
          }).toArray((err, files) => {

            if (err) {
              res.json(err);
            }

            if (files.length > 0) {
              let mime = 'application/pdf';
              res.set('Content-Type', mime);
              let readStream = gfs.createReadStream({
                  filename: picId
                });
              readStream.pipe(res);
            } else {
              res.json('Please Submit a file first');
            }
          });
      });

    app.get('/clicks/:link', (req, res) => {

        const picId = req.params.link;

        gfs.files.find({
            filename: picId
          }).toArray((err, files) => {
            if (err) {
              res.json(err);
            }

            if (files.length > 0) {
              let mime = 'application/pdf';
              res.set('Content-Type', mime);
              let readStream = gfs.createReadStream({
                  filename: picId
                });
              readStream.pipe(res);
            } else {
              res.json('File Not Found');
            }
          });
      });

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

    app.post('/updateTags', (req, res) => {
        req.user.local.tags.push(Object.keys(req.body)[0]);
        req.user.save();
      });

    app.post('/dude', (req, res) => {
        if (Object.keys(req.body)[0] == null) {
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

    app.get('/eventStream', eventsAPI);

    // used when a user goes to the setting's page and updates information
    app.post('/settings', isLoggedIn, settingsMiddleWare.updateUser);

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
      });
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
