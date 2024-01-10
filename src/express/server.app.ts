import express, { Application, Router } from 'express';
import { createDataRoutes } from './routes/data.routes';
import { DatabaseAccessor } from '../_models/storage/database-accessor';
import { ConfigResolver } from './_helpers/config.resolver';
import { Logger } from '../_helpers/logger';

export class ServerApp {
  private _app: Application = express();
  constructor(private _dataBaseAccessor: DatabaseAccessor) {}
  public initialize(): void {
    const baseURL = ConfigResolver.getBaseURL();
    const port = ConfigResolver.getPort();
    const dataRoutes = createDataRoutes(this._dataBaseAccessor);

    this._app.use(express.json());
    this._app.use(baseURL, dataRoutes);

    const router = Router();
    router.get('/health', (req, res) => {
      const health = {
        uptime: process.uptime(),
        message: 'Ok',
        date: new Date(),
      };
      Logger.log(`ServerApp: Health check ${JSON.stringify(health)}}`);
      res.status(200).send(health);
    });
    this._app.use('/', router);

    this._app.listen(port, () => {
      Logger.log(`ServerApp: Server is running on port ${port}`);
    });
  }
}
