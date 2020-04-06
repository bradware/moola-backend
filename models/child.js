'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

var ChildSchema = mongoose.Schema({
  first_name: {type: String, required: true, trim: true},
  last_name: {type: String, required: true, trim: true},  
  email: {type: String, required: true, unique: true, trim: true},
  password: {type: String, required: true},
  phone_number: {type: String, required: true, trim: true},
  date_of_birth: {type: String, required: true, trim: true},
  ssn4: {type: String, required: true, trim: true},
  address: {
    street: {type: String, required: true, trim: true},
    city: {type: String, required: true, trim: true},
    state: {type: String, required: true, trim: true},
    postal_code: {type: String, required: true, trim: true}
  },
  account: {
    routing_number: {type: String, trim: true},
    account_number: {type: String, trim: true},
  },
  parent: {type: mongoose.Schema.Types.ObjectId, ref: 'Parent'},
  weekly_allowance: {type: Number, default: 0, required: true},
  created_at: {type: Date, default: Date.now, required: true}
});

// Authenticate child against database
ChildSchema.statics.authenticate = function(email, password, callback) {
  Child.findOne({email: email}).exec(function(error, child) {
    if (error) {
      // Mongo returned an error
      callback(error);
    } else if (!child) {
      // No child was found
      var err = new Error('Email not found');
      err.status = 401;
      callback(err);
    } else {
      // Found child so comparing password to hashed/salted version in Mongo
      bcrypt.compare(password, child.password, function(error, result) {
        if (result) {
          // Password matched, returning the child
          return callback(null, child);
        } else {
          // Password did not match the email
          var err = new Error('Wrong password');
          err.status = 401;
          return callback(err, null);
        }
      });
    }
  });
};

// Hash & Salt password, ssn4 before saving to Mongo
ChildSchema.pre('save', function(next) {
  // Salts & hashes password
  var child = this;
  bcrypt.hash(child.password, SALT_ROUNDS, function(err, hash) {
    if (err) {
      return next(err);
    } else {
      child.password = hash;
      bcrypt.hash(child.ssn4, SALT_ROUNDS, function(err, hash) {
        if (err) {
          return next(err);
        } else {
          child.ssn4 = hash;
          next();
        }
      });
    }
  });
});

var Child = mongoose.model('Child', ChildSchema);
module.exports = Child;
