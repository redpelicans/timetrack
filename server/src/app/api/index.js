import express from 'express';

export function init(mainApp, resources){
  let app = express();

  require('./clients').init(app, resources);

  return app;
}