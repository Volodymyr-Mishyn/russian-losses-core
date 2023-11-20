import { Request, Response } from 'express';
import { DatabaseAccessor } from '../../_models/storage/database-accessor';
import { MoDData } from '../../_models/entities/mod/mod-model';
import { flattenMoDData } from '../../_helpers/mod-utils/mod-flattener';

export class DataController {
  constructor(private _dataBaseAccessor: DatabaseAccessor) {}

  public async getMoDData(request: Request, response: Response) {
    const { start, end, flat } = request.query;
    try {
      let data: MoDData;
      if (start && end) {
        data = await this._dataBaseAccessor.getMoDDataInRange(`${start}`, `${end}`);
      } else {
        data = await this._dataBaseAccessor.getAllMoDData();
      }
      const responseData = flat ? flattenMoDData(data) : data;
      response.send(responseData);
    } catch (error) {
      console.error('Error: ', error);
      response.status(500).send();
    }
  }

  public async getOryxCountryData(request: Request, response: Response) {
    const { country } = request.query;
    if (!country) {
      response.status(400).send({ error: 'Country not provided' });
      return;
    }
    try {
      const allMoDData = await this._dataBaseAccessor.getAllOryxDataForCountry(`${country}`);
      response.send(allMoDData);
    } catch (error) {
      response.status(500).send();
    }
  }
}
