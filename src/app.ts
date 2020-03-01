import express, { Express } from 'express';
import routes from './routes';

import './database';

class App {
  public server: Express;

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares(): void {
    this.server.use(express.json());
  }

  routes(): void {
    this.server.use(routes);
  }
}

export default new App().server;
