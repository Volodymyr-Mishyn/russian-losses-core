import { Router, Request, Response } from 'express';
import { DatabaseAccessor } from '../../_models/storage/database-accessor';
import { ConfigResolver } from '../_helpers/config.resolver';
import { DataController } from '../controllers/data.controller';

export function createDataRoutes(databaseAccessor: DatabaseAccessor) {
  const dataController = new DataController(databaseAccessor);
  const router = Router();
  router.get(`/mod`, (request: Request, response: Response) => {
    return dataController.getMODData(request, response);
  });
  router.get(`/oryx`, (request: Request, response: Response) => {
    return dataController.getOryxCountryData(request, response);
  });
  return router;
}
