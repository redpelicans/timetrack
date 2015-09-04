import mongobless from 'mongobless';
// load models
import '../models';


const _ = require('lodash')
    , debug = require('debug')('timetrack:models');

export default function init(params) {
  return function(cb) {
    mongobless.connect(_.extend({verbose: false}, params), (err) => {
      if(err){
        console.log(err);
        return cb(err);
      }
      debug('Timetrack models are ready to help you ...');
      cb(err, mongobless);
    });
  }
}
