import { App } from './app';
import { ConfigService } from './services/config/config.service';

const server: App = new App();
server.start(ConfigService.port);