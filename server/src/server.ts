import { App } from './app';
import { PORT } from './config/env.config';

const server = new App();
server.start(5000);