'use strict';

require('rootpath')();

var middleware = require('middleware')
var authController = require('controllers/auth');
var plaidController = require('controllers/plaid');
var tsysController = require('controllers/tsys');
var randomController = require('controllers/random');

module.exports = function(app, router) {
  // CORS
  router.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', ' Access-Control-Allow-Origin: https://moola-api-staging.herokuapp.com', 'X-Requested-With, Authorization, Content-Type, Username, Password, Token');
    next();
  });

  // AUTH
  router.post('/auth/login',
    middleware.isLoggedOut,
    middleware.loginFieldsValid,
    authController.login);
  router.get('/auth/logout',
    middleware.isLoggedIn,
    middleware.authorizeToken,
    authController.logout);
  router.get('/auth/logout_no_headers',
    authController.logout_no_headers);
  router.post('/auth/register',
    middleware.userInfoFieldsValid,
    middleware.addressFieldsValid,
    authController.register);

  // PLAID
  router.post('/plaid/test', plaidController.testConnectPost);
  router.post('/plaid/real', plaidController.realConnectPost);
    
  // TSYS
  router.post('/tsys/getAccountData', tsysController.getAccountData);
  router.get('/tsys/getTransactionData', tsysController.getTransactionData);

  // TESTING
  router.get('/random', randomController);

  // APP now using router
  app.use(router);
};
