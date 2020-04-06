'use strict';

require('rootpath')();

var express = require('express');
var middleware = require('middleware');
var jwt = require('jsonwebtoken');
var Parent = require('models/parent');

/**
 * Signup/register
 */
function register(req, res, next) {
  var parent = new Parent(req.body);
  parent.save(function (err, newParent) {
    if (err) {
      return next(err);
    } else {
      var token = jwt.sign({data: newParent.email}, 'moola-secret-token', {expiresIn: '1h'});
      req.session.userID = newParent.email;
      res.status(201);
      res.json({
        header: {
          token: token
        },
        body: {
          parent: newParent
        }
      });
    }
  });
};

/**
 * Login/Auth
 */
function login(req, res, next) {
  Parent.authenticate(req.body.email, req.body.password, function (error, parent) {
    if (error) {
      next(error);
    } else {
      // Password matched
      var token = jwt.sign({data: parent.email}, 'moola-secret-token', {expiresIn: '1h'});
      req.session.userID = parent.email;
      res.status(200);
      res.json({
        header: {
          token: token
        },
        body: {
          parent: parent
        }
      });
    }
  });
};

function logout(req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      return next(err);
    } else {
      return res.json({
        success: {
          message: 'User logged out'
        }
      });
    }
  });
};

function logout_no_headers(req, res, next) {
  console.log('Session id destroy: ' + req.session.id);
  req.session.destroy(function (err) {
    if (err) {
        return next(err);
    } else {
      return res.json({
        success: {
          message: 'User logged out'
        }
      });
    }
  });
};

module.exports.register = register;
module.exports.login = login;
module.exports.logout = logout;
module.exports.logout_no_headers = logout_no_headers;
