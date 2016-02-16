'use strict';

console.log('Running in ' + process.env.NODE_ENV + ' mode');
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./configureStore.prod');
} else {
  module.exports = require('./configureStore.dev');
}
//# sourceMappingURL=configureStore.js.map
