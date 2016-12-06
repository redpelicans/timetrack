import path from 'path';
import feathers from 'feathers';
import favicon from 'serve-favicon';
import compress from 'compression';
import cors from 'cors';
import hooks from 'feathers-hooks';
import rest from 'feathers-rest';
import bodyParser from 'body-parser';
import socketio from 'feathers-socketio';
import middleware from './middleware';
import services from './services';

const init = (config) => {
  const app = feathers();
  app.set('config', config);

  app.use(compress())
    .options('*', cors())
    .use(cors())
    .use(favicon( path.join(config.public, 'favicon.ico') ))
    .use('/', feathers.static(config.public))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .configure(hooks())
    .configure(rest())
    .configure(socketio())
    .configure(services)
    .configure(middleware);

  return app;
};

export default { init };

