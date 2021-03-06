import express from 'express';

export function init(mainApp, resources, params) {
  let app = express();

  require('./companies').init(app, resources);
  require('./people').init(app, resources);
  require('./missions').init(app, resources);
  require('./workblocks').init(app, resources);
  require('./check_url').init(app, resources);
  require('./skills').init(app, resources);
  require('./cities').init(app, resources);
  require('./countries').init(app, resources);
  require('./tags').init(app, resources);
  require('./notes').init(app, resources);
  require('./events').init(app, resources);

  return app;
}
