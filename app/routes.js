// app/routes.js
var Subgroup = require('./models/subgroup');
var User = require('./models/user');
var lesson = require('../config/lessons.js');
var multer = require('multer');
var fs = require('fs');
var Grid = require('gridfs-stream');
var request = require('request');
var zip = require('express-zip');
var auth = require("http-auth");




module.exports = function(app, passport, mongoose) {


    var basic = auth.basic({
        realm: "Companies Only.",
        file: __dirname + "/users.htpasswd"
    });


    Grid.mongo = mongoose.mongo;
    var gfs = Grid(mongoose.connection.db);

    app.get('/', function(req, res) {

        res.render('index.ejs', {
            user: req.user
        });
    });

    var pdfs = [];

    app.post("/testpdf", function(req, res){
        for(var i=0; i<req.body.pdfs.length; i++){
            var str = req.body.pdfs[i].slice(24, req.body.pdfs[i].length);
            pdfs.push({"path": "app../pdfs/"+req.body.pdfs[i], "name":str})
            //pdfs.push(req.body.pdfs[i]);
        }
        console.log(pdfs);
        res.send("asdf");


    });

    app.get("/downloadPDF", function(req,res){
        res.zip(pdfs);
    })


app.get('/feed', function(req,res){
    res.render('feed.ejs');
})

    app.post('/facebook', function(req, res){
        var json;
        var token = 'EAASBfsZBnMkUBAIWgtabr6IzPANJ8NE8027RaKYeG52P09iRDyoJZAPkeKQxPfq7ZBqHe3GehgyB3A7JOYi4LIX6U0fKoWTOcDZCKCfo9IJbRyBHWNVWaUA324Cw8p4kPdTBSoqzbNbT9RGYY2NqesDzWZC1jG7AZD';
        request( ('https://graph.facebook.com/v2.6/494011427297346/events?access_token=' + token), function (error, response, body) {
          if (!error && response.statusCode == 200) {
            // console.log(body)
                // console.log(response.data);
                // console.log(response);
                json = JSON.parse(body);
                res.send(json.data)
                //insertIntoDB(json);
          }
            //display the error for the API
            else
            {
                console.log('response: \n');
                console.log(response);
                console.log('error: ' + error);
            }
        });


    })

    app.get('/contact', function(req, res) {
        res.render('contact.ejs', {
            user: req.user
        });
    });

    app.get('/resume', isLoggedIn, function(req, res) {
        res.render('resume/profile_resume.ejs', {
            user: req.user
        });
    });

    app.get('/repo', auth.connect(basic), function(req, res) {
        res.render('resume/repo.ejs', {
            user: req.user
        });
    });

    app.post('/updateProfile', function(req,res){
        req.user.local.question1 = req.body.question1;
        req.user.local.question2 = req.body.question2;
        req.user.local.question3 = req.body.question3;
        req.user.save();
    })

    app.get('/contactus', function(req, res) {
        res.render('contactus/contactus.ejs', {
            user: req.user
        });
    });

    app.get('/events', function(req, res) {
        res.render('events.ejs', {
            user: req.user
        });
    });

    app.get('/ufpt', function(req, res) {
        res.render('ufpt.ejs');
    });


    app.get('/login', function(req, res) {
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '../pdfs/')
  },
  filename: function (req, file, cb) {
    cb(null, req.user._id+file.originalname)
  }
})

var uploading = multer({ storage: storage });


    var name = "";

    app.post('/resume/upload', uploading.array('pdfs', 10000), function(req, res) {
        var dirname = require('path').dirname(__dirname);
        var filename = req.user._id+req.files[0].originalname;
        var path = req.files[0].path;
        var type = req.files[0].mimetype;

        var read_stream = fs.createReadStream(path);

        var conn = req.conn;


        var writestream = gfs.createWriteStream({
            filename: filename
        });


        req.user.local.resumeLink =filename;
        req.user.save();
        read_stream.pipe(writestream);
    });

    app.get('/file', function(req, res) {

        var pic_id = req.user.local.resumeLink;

        gfs.files.find({
            filename: pic_id
        }).toArray(function(err, files) {

            if (err) {
                res.json(err);
            }
            if (files.length > 0) {
                var mime = 'application/pdf';
                res.set('Content-Type', mime);
                var read_stream = gfs.createReadStream({
                    filename: pic_id
                });
                read_stream.pipe(res);
            } else {
                res.json("Please Submit a file first");
            }
        });
    });


    app.get("/clicks/:link", function(req,res){

        var pic_id = req.params.link;


        gfs.files.find({
            filename: pic_id
        }).toArray(function(err, files) {
            if (err) {
                res.json(err);
            }
            if (files.length > 0) {
                var mime = 'application/pdf';
                res.set('Content-Type', mime);
                var read_stream = gfs.createReadStream({
                    filename: pic_id
                });
                read_stream.pipe(res);
            } else {
                res.json('File Not Found');
            }
        });
    })



    app.get('/signup', function(req, res) {
        res.render('signup/signup.ejs', {
            message: req.flash('signupMessage')
        });
    });


    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    //Checks for profile.ejs in the profile directory folder
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile/profile.ejs', {
            user: req.user
        });
    });


    //Checks for profile.ejs in the profile directory folder
    app.get('/code', isLoggedIn, function(req, res) {
        res.render('code_tuts/code.ejs', {
            user: req.user
        });
    });

    app.post('/updateTags', function(req,res){
        req.user.local.tags.push(Object.keys(req.body)[0]);
        req.user.save();
    });

    app.post('/dude', function(req,res){
        if(Object.keys(req.body)[0]==null){
            User.find({}, function(err, users) {
                res.send(users); 
            }); 
        }
        else{
              User.find({"local.tags": Object.keys(req.body)[0]}, function(err, users) {
                res.send(users); 
              });
        }
    });


    app.get('/update', isLoggedIn, function(req, res) {



        Subgroup.find({
            name: req.query.name
        }, function(err, subgroup) {
            if (err) throw err;
            subgroup.members.push(req.user._id);

        });

    });


    app.get('/up', function(req, res) {

        req.user.local.level = req.user.local.level + 1;
        req.user.save(function(err) {
            res.send(lesson[req.user.local.level])
        });


    });

    //Checks for changepassword.ejs in the changepassword directory folder
    app.get('/changePassword', isLoggedIn, function(req, res) {
        res.render('changePassword/changePassword.ejs', {
            user: req.user
        });
    });

    var settingsMiddleWare = require('./middleware/settings.middleware.js');
    app.post('/changePassword', isLoggedIn, settingsMiddleWare.changePassword);

    //Checks for settings.ejs in the settings directory folder
    app.get('/settings', isLoggedIn, function(req, res) {
        res.render('settings/settings.ejs', {
            user: req.user
        });
    });

    var eventsAPI = require('./middleware/eventsAPI.js')
    app.get('/eventStream', eventsAPI);

    //used when a user goes to the setting's page and updates information
    var settingsMiddleWare = require('./middleware/settings.middleware.js');
    app.post('/settings', isLoggedIn, settingsMiddleWare.updateUser);

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}