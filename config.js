var config = {
  local: {
    port: process.env.PORT || 3000,
    mongoDB: process.env.MONGODB || 'mongodb://localhost:27017/moola',
    domain: 'api-local.bankwithmoola.com'
  },
  staging: {
    port: process.env.PORT,
    mongoDB: process.env.MONGODB_URI || 'mongodb://heroku_ss69c70v:25jdqfg5kiaoosvklbb8ijef6s@ds147799.mlab.com:47799/heroku_ss69c70v',
    domain: 'moola-api-staging.herokuapp.com'
  },
  production: {
    port: process.env.PORT || 443,
    mongoDB: process.env.MONGODB_URI || 'mongodb://heroku_t28rsvt1:ahaqa9egl41b7t5jcfitc4rk7c@ds145245.mlab.com:45245/heroku_t28rsvt1',
    domain: 'api.bankwithmoola.com'
  }
};

module.exports = function() {
  var node_env = process.env.NODE_ENV || 'local';
  return config[node_env];
};