var R = require('ramda');

const merge = (a, b) => R.is(Object, a) && R.is(Object, b) ? deepMerge(a, b) : b;
const deepMerge = (a, b) => R.mergeWith(merge, a, b);

const defaultConfig = require('./default');
const supportedModes = { 
  development: require('./development'), 
  production: require('./production'), 
  testing: require('./testing') 
};
const config = supportedModes[process.env.NODE_ENV];

module.exports = deepMerge(defaultConfig, config || {});
