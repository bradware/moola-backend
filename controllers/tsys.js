'use strict';

require('rootpath')();

var https = require('https');
var Transaction = require('models/transaction');
var tsysApiKey = '51132146540652';

var options = {
  host: 'beta.tsysapi.com',
  port: 443,
  path: '',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + tsysApiKey,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

function getAccountData(req, res, next) {
  options.path = '/sandbox/transaction/00000010001/cycle/from-2016-11-01/to-2016-11-30';

  var tranRequest = https.request(options, function (tranResponse) {
    var body = '';
    tranResponse.on('data', function (d) {
      body += d;
    });
    tranResponse.on('end', function () {
      var r = JSON.parse(body);
      var childAccountNumber = 1;
      r['transactions'].forEach(function (transaction) {
        var docDict = {};
      //Need to check for duplicate transactions
        docDict['child_id'] = childAccountNumber;
        docDict['transaction_type'] = transaction['meta'] ? (transaction['meta']['transactionClassCode'] || '') : '';
        docDict['amount'] = transaction['amount'] ? (transaction['amount']['value'] || '') : '';
        docDict['date'] = transaction['date'] || '';
        docDict['merchant'] = transaction['merchant'] ? (transaction['merchant']['name'] || '') : '';
        docDict['category'] = transaction['code'] || '';
        docDict['withdrawal_type'] = transaction['type'] || '';

        var transaction = new Transaction(docDict);
        transaction.save(function (err, newTransaction) {
          if (err) {
            console.log(err);
          } else {
            console.log('Transaction Database storage successful');
          }
        });
      });
    });
  });

  tranRequest.on('error', function (e) {
    console.error(e);
  });
  tranRequest.write('', function (err) {
    tranRequest.end();
  });
  tranRequest.end();

  res.json({
    body: {
      string: 'success'
    }
  });
}

function getTransactionData(req, res, next) {
  Transaction.getChildTransactions(function(error, transaction) {
    if (error) {
      next(error);
    } else {
      res.json({
        body: {
          transaction: transaction
        }
      });
    }
  });
}

module.exports.getAccountData = getAccountData;
module.exports.getTransactionData = getTransactionData;
