import { initApp }  from './app';
import config from '../../config';

const { server: { host, port } } = config;
const server = initApp(config).listen(port);

server.on('listening', () => console.log(`Feathers application started on ${host}:${port}`));

if(module.hot) {
  console.log(module.hot);
}
