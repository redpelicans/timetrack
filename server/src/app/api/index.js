import express from 'express';

export function init(mainApp, resources) {
  let app = express();

  require('./companies').init(app, resources);
  require('./missions').init(app, resources);
  require('./workblocks').init(app, resources);
  require('./check_url').init(app, resources);

  return app;
}
