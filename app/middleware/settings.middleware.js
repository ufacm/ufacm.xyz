var User  = require('../models/user');


var settingsMiddleWare = {
  updateUser: function(req, res, next) {


    // console.log(req);
    User.findOne({ '_id' : req.user._id}, function(err, user) {
      // if there are any errors, return the error
      if (err)
      {
        console.log(err);
        res.send(500);
      }

      // check to see if theres already a user with that email
      if (user) {
        user.local.onListServe = req.body.listServe;
        user.local.firstName = req.body.firstName;
        user.local.lastName = req.body.lastName;
        user.local.email = req.body.email;
        user.local.phoneNumber  =req.body.phoneNumber;

        user.save();
        res.send('200');
      }

    });

  }
};


module.exports = settingsMiddleWare;
