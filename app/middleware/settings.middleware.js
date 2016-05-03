var User  = require('../models/user');


var settingsMiddleWare = {
  updateUser: function(req, res, next) {


    User.findOne({ '_id' : req.user._id}, function(err, user) {
      // if there are any errors, return the error
      if (err)
      {
        console.log(err);
        res.send(500);
      }

      //apply changes
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
  },

  changePassword: function(req,res,next) {
      User.findOne({ '_id' :  req.user.id }, function(err, user) {
        // if there are any errors, return the error before anything else
        if (err)
            return res.send(500);

        // if no user is found, return 500
        if (!user)
        {
              //this should never happen in this state
              res.send(500);
        }

        // if the user is found but the password is wrong send a 401?
        if (!user.validPassword(req.body.originalPassword))
              res.status(401).send({'error' : 'The password you typed is incorrect'});

      });
    }
};


module.exports = settingsMiddleWare;
