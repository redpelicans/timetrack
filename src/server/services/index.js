'use strict';
const authentication = require('./authentication');
const user = require('./user');
const mongoose = require('mongoose');
module.exports = function() {
  const app = this;
  const { mongodb } = app.get('config');
  
  mongoose.connect(mongodb);
  mongoose.Promise = global.Promise;
  
  // app.configure(authentication);
  app.configure(user);
};
