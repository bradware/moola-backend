'use strict';

require('rootpath')();

var qs = require('querystring');
var https = require('https');

var options = {
  host: 'tartan.plaid.com',
  port: null,
  path: '',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
};

// TEST CONNECT WITH FAKE CREDS
function testConnectPost(req, res, next) {
  options.path = '/connect';

  var post_data = qs.stringify({
    client_id: 'test_id',
    secret: 'test_secret',
    username: 'plaid_test',
    password: 'plaid_good',
    type: 'wells'
  });
  
  var tranRequest = https.request(options, function(tranResponse) {
    var body = '';
    tranResponse.on('data', function(d) {
      body += d;
    });
    tranResponse.on('end', function(data) {
      res.send(JSON.parse(body));
    });
  });

  tranRequest.on('error', function(err) {
    next(err);
  });
  
  tranRequest.write(post_data, function(err) {
    if (err) {
      next(err);
    }
    tranRequest.end();
  });
}

// REAL CONNECT WITH OUR CREDS
function realConnectPost(req, res, next) {
  options.path = '/connect';

  var post_data = qs.stringify({
    client_id: '57f3b83e062e8c1d58ff93a2',
    secret: '2379d1baf588384a25a73aa028c234',
    username: 'plaid_test',
    password: 'plaid_good',
    type: 'wells'
  });
  
  var tranRequest = https.request(options, function(tranResponse) {
    var body = '';
    tranResponse.on('data', function(d) {
      body += d;
    });
    tranResponse.on('end', function() {
      var r = JSON.parse(body);
      res.send(r);
    });
  });

  tranRequest.on('error', function(err) {
    next(err);
  });
  
  tranRequest.write(post_data, function(err) {
    if (err) {
      next(err);
    }
    tranRequest.end();
  });
}

module.exports.testConnectPost = testConnectPost;
module.exports.realConnectPost = realConnectPost;
