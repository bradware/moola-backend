'use strict';

var jwt = require('jsonwebtoken');

function isLoggedIn(req, res, next) {
  if (req.session && req.session.userID) {
    return next();
  } else {
    var err = new Error('User not logged in');
    err.status = 401;
    return next(err);
  }
}

function isLoggedOut(req, res, next) {
  if (req.session && req.session.userID) {
    var err = new Error('User already logged in');
    err.status = 401;
    return next(err);
  } else {
    return next();
  }
}

function authorizeToken(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.query.token || req.headers['token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, 'moola-secret-token', function (err, decoded) {
      if (err) {
        var err = new Error('Failed to authorize token');
        err.status = 401;
        return next(err);
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    var err = new Error('No token provided');
    err.status = 403;
    return next(err);
  }
}

function loginFieldsValid(req, res, next) {
  if (req.body.email && req.body.password) {
    next();
  } else {
    var err = new Error('Email and password are required');
    err.status = 401;
    return next(err);
  }
}

// TODO: Combine functions
function userInfoFieldsValid(req, res, next) {
  if (req.body.first_name && req.body.last_name && req.body.date_of_birth && req.body.email && req.body.password && req.body.phone_number
      && req.body.address) {
    next();
  } else {
    var err = new Error('All fields are required to register');
    err.status = 400;
    return next(err);
  }
}

function addressFieldsValid(req, res, next) {
  if (req.body.address.street && req.body.address.city && req.body.address.state && req.body.address.postal_code) {
    next();
  } else {
    var err = new Error('All address fields are required to register');
    err.status = 400;
    return next(err);
  }
}

module.exports.isLoggedIn = isLoggedIn;
module.exports.isLoggedOut = isLoggedOut;
module.exports.authorizeToken = authorizeToken;
module.exports.loginFieldsValid = loginFieldsValid;
module.exports.userInfoFieldsValid = userInfoFieldsValid;
module.exports.addressFieldsValid = addressFieldsValid;
