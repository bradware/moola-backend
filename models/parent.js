'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

var ParentSchema = mongoose.Schema({
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
  children: [{type: mongoose.Schema.Types.ObjectId, ref: 'Child'}],
  created_at: {type: Date, default: Date.now, required: true},
});

// Authenticate parent against database
ParentSchema.statics.authenticate = function(email, password, callback) {
  Parent.findOne({email: email}).exec(function(error, parent) {
    if (error) {
      // Mongo returned an error
      callback(error);
    } else if (!parent) {
      // No parent was found
      var err = new Error('Email not found');
      err.status = 401;
      callback(err);
    } else {
      // Found parent so comparing password to hashed/salted version in Mongo
      bcrypt.compare(password, parent.password, function(error, result) {
        if (result) {
          // Password matched, returning the parent
          return callback(null, parent);
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
ParentSchema.pre('save', function(next) {
  // Salts & hashes password
  var parent = this;
  bcrypt.hash(parent.password, SALT_ROUNDS, function(err, hash) {
    if (err) {
      return next(err);
    } else {
      parent.password = hash;
      bcrypt.hash(parent.ssn4, SALT_ROUNDS, function(err, hash) {
        if (err) {
          return next(err);
        } else {
          parent.ssn4 = hash;
          next();
        }
      });
    }
  });
});

var Parent = mongoose.model('Parent', ParentSchema);
module.exports = Parent;
