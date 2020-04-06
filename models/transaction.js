'use strict';

var mongoose = require('mongoose');

var TransactionSchema = mongoose.Schema({
  child_id: {type: String, required: true, trim: true},
  transaction_type: {type: String, required: true, trim: true}, //Enum: Purhcase, Fee, Payment, Cash
  amount: {type: Number, required: true},
  date: {type: Date, required: true},
  merchant: {type: String, required: false, trim: true},
  category: {type: String, required: true, trim: true},
  withdrawal_type: {type:String, required: true, trim: true} // Enum: Debit, Credit, Payment
});

TransactionSchema.statics.getChildTransactions = function(callback) {
  Transaction.find({child_id: 1}).exec(function(error, transaction) {
    if (error) {
      // Mongo returned an error
      callback(error);
    } else if (!transaction) {
      // No user was found
      var err = new Error('Child ID not found');
      err.status = 401;
      callback(err);
    } else {
      callback(null, transaction)
    }
  });
}

var Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;
