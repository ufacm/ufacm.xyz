// app/routes.js
module.exports = function(app, passport) {


	app.get('/', function(req, res) {
		res.render('index.ejs', {
			user : req.user 
		}); 
	});

	app.get('/contact', function(req, res) {
		res.render('contact.ejs'); 
	});

	app.get('/events', function(req, res) {
		res.render('events.ejs'); 
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

		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});


	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', 
		failureRedirect : '/signup', 
		failureFlash : true 
	}));


	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user 
		});
	});

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
