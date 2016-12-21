const util = require('./util');
const defaultConfig = require('./default');
const supportedModes = { 
  development: require('./development'), 
  production: require('./production'), 
  testing: require('./testing') 
};
const config = supportedModes[process.env.NODE_ENV];

module.exports = util.deepMerge(defaultConfig, config || {});
