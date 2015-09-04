import params from '../../params';
import * as server from './index';
import debug from 'debug';

require('better-log').install();

let logerror = debug('timetrack:error')
  , loginfo = debug('timetrack:info');

server.create(params)
  .then(transac =>{ 
    loginfo('ready to track time with U ...');
  }).catch(err => { throw err });

