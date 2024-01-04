import { Router, Request, Response } from 'express';
import { DatabaseAccessor } from '../../_models/storage/database-accessor';
import { DataController } from '../controllers/data.controller';
import { Logger } from '../../_helpers/logger';

export function createDataRoutes(databaseAccessor: DatabaseAccessor) {
  const dataController = new DataController(databaseAccessor);
  const router = Router();
  router.get(`/mod`, (request: Request, response: Response) => {
    Logger.log(`ServerApp: GET /mod`);
    return dataController.getMoDData(request, response);
  });
  router.get(`/oryx`, (request: Request, response: Response) => {
    Logger.log(`ServerApp: GET /oryx`);
    return dataController.getOryxCountryData(request, response);
  });
  return router;
}
