// app/routes.js

var Subgroup  = require('./models/subgroup');
var lesson = require('../config/lessons.js');
var multer = require('multer');
var fs = require('fs');
var Grid = require('gridfs-stream');

module.exports = function(app, passport, mongoose) {


Grid.mongo = mongoose.mongo;
var gfs = Grid(mongoose.connection.db);


	app.get('/', function(req, res) {
		res.render('index.ejs', {
			user : req.user
		});
	});

	app.get('/contact', function(req, res) {
		res.render('contact.ejs', {
			user : req.user
		});
	});

	app.get('/contactus', function(req,res){
		res.render('contactus/contactus.ejs', {
			user : req.user
		});
	});

	app.get('/events', function(req, res) {
		res.render('events.ejs', {
			user : req.user
		});
	});

	app.get('/ufpt', function(req, res) {
		res.render('ufpt.ejs');
	});


	app.get('/login', function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile',
		failureRedirect : '/login',
		failureFlash : true
	}));

	var uploading = multer({
  		dest: __dirname + '../pdfs/',
	});


	var name = "";

	app.post('/profile/upload',uploading.array('pdfs',10000), function(req, res) {
		     var dirname = require('path').dirname(__dirname);
     var filename = req.files[0].originalname;
     var path = req.files[0].path;
     var type = req.files[0].mimetype;
      
     var read_stream =  fs.createReadStream(path);
 
     var conn = req.conn;
     
     
 
     
      
     var writestream = gfs.createWriteStream({
        filename: filename
    });

  	req.user.local.dudud = filename;
  	console.log(req.user.local);
     read_stream.pipe(writestream);
	});

	app.get('/file',function(req,res){

	  var pic_id = req.user.local.resumeLink;

 
       gfs.files.find({filename: pic_id}).toArray(function (err, files) {
 
        if (err) {
            res.json(err);
        }
        if (files.length > 0) {
            var mime = 'application/pdf';
            res.set('Content-Type', mime);
            var read_stream = gfs.createReadStream({filename: pic_id});
            read_stream.pipe(res);
        } else {
            res.json('File Not Found');
        }
    });
});





	app.get('/signup', function(req, res) {
		res.render('signup/signup.ejs', { message: req.flash('signupMessage') });
	});


	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	//Checks for profile.ejs in the profile directory folder
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile/profile.ejs', {
			user : req.user
		});
	});

		//Checks for profile.ejs in the profile directory folder
	app.get('/code', isLoggedIn, function(req, res) {
		res.render('code_tuts/code.ejs', {
			user : req.user
		});
	});


	app.get('/update', isLoggedIn, function(req,res){		



		Subgroup.find({ name: req.query.name }, function(err, subgroup) {
		  if (err) throw err;
		  	subgroup.members.push(req.user._id);

		});

	});


	app.get('/up', function(req,res){

		req.user.local.level = req.user.local.level + 1;
		req.user.save(function(err){
			res.send(lesson[req.user.local.level])
		});
		
		
	});

	//Checks for changepassword.ejs in the changepassword directory folder
	app.get('/changePassword', isLoggedIn, function(req, res) {
		res.render('changePassword/changePassword.ejs', {
			user : req.user
		});
	});

	var settingsMiddleWare = require('./middleware/settings.middleware.js');
	app.post('/changePassword', isLoggedIn, settingsMiddleWare.changePassword);

	//Checks for settings.ejs in the settings directory folder
	app.get('/settings', isLoggedIn, function(req, res) {
		res.render('settings/settings.ejs', {
			user : req.user
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
