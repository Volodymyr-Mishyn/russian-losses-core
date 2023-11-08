import express, { Application } from 'express';
import { createDataRoutes } from './routes/data.routes';
import { DatabaseAccessor } from 'src/_models/storage/database-accessor';
import { ConfigResolver } from './_helpers/config.resolver';

export class ServerApp {
  private _app: Application = express();
  constructor(private _dataBaseAccessor: DatabaseAccessor) {}
  public initialize(): void {
    const baseURL = ConfigResolver.getBaseURL();
    const port = ConfigResolver.getPort();
    const dataRoutes = createDataRoutes(this._dataBaseAccessor);
    this._app.use(express.json());
    this._app.use(baseURL, dataRoutes);
    this._app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}
