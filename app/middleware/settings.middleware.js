'use strict';

const User  = require('../models/user');

const settingsMiddleWare = {
  updateUser: (req, res, next) => {

    User.findOne({ _id: req.user._id }, (err, user) => {
      // if there are any errors, return the error
      if (err)
      {
        console.log(err);
        res.send(500);
      }

      // apply changes
      if (user) {
        user.local.onListServe = req.body.listServe;
        user.local.firstName = req.body.firstName;
        user.local.lastName = req.body.lastName;
        user.local.PhoneNumber  = req.body.phoneNumber;

        user.save((err) => {
          if (err) {
            console.log('mongoose error!');
            res.send(500);
          }

          res.send(200);
        });
      }
    });
  },

  changePassword: (req, res, next) => {

      if (req.body.newPassword1 !== req.body.newPassword2 || !req.body.oldPassword)
      {
        return res.send(500);
      }

      User.findOne({ _id:  req.user.id }, (err, user) => {
        // if there are any errors, return the error before anything else
        if (err || !user) {
          return res.send(500);
        }

        if (!user.validPassword(req.body.oldPassword))
        {
          return res.status(200).send({ credError: 'true' });
        }

        // set password
        user.local.password = user.generateHash(req.body.newPassword1);

        // save it
        user.save((err) => {
          if (err)
          {
            return res.send(500);
          }
        });

        res.status(200).send({ credError: 'false' });
      });
    }
};

module.exports = settingsMiddleWare;
