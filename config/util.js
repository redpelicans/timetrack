var R = require('ramda');

const merge = (a, b) => R.is(Object, a) && R.is(Object, b) ? deepMerge(a, b) : b;
const deepMerge = (a, b) => R.mergeWith(merge, a, b);

module.exports = {
  deepMerge: deepMerge,
};
