import app  from './app';
import config from '../../config';

const { server: { host, port } } = config;
const server = app.init(config).listen(port);

server.on('listening', () => console.log(`Feathers application started on ${host}:${port}`));
