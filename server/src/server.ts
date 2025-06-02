import { App } from './app';
import { PORT } from './config/env.config';

const server: App = new App();
server.start(PORT)