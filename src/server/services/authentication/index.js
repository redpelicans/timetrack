'use strict';

const authentication = require('feathers-authentication');


module.exports = function() {
  const app = this;

  const { auth } = app.get('config');
  
  app.configure(authentication(auth));
};
