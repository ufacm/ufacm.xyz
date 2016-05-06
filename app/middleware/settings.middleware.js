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

      if(req.body.newPassword1 !== req.body.newPassword2 || !req.body.oldPassword)
      {
        return res.send(500);
      }


      User.findOne({ '_id' :  req.user.id }, function(err, user) {
        // if there are any errors, return the error before anything else
        if (err || !user)
            return res.send(500);

        if((req.body.email != user.local.email) || !user.validPassword(req.body.oldPassword))
        {
          return res.status(200).send({'credError' : 'true'});
        }

        //set password
        user.local.password = user.generateHash(req.body.newPassword1);

        //save it
        user.save(function(err){
          if(err)
          {
            return res.send(500);
          }
        });

        res.status(200).send({'credError' : 'false'});
      });
    }
};


module.exports = settingsMiddleWare;
