// app/routes.js
module.exports = function(app, passport) {


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
