import { Request, Response } from 'express';
import { DatabaseAccessor } from '../../_models/storage/database-accessor';
import { MODData } from '../../_models/entities/mod/mod-model';
import { flattenMODData } from '../../_helpers/mod-utils/mod-flattener';

export class DataController {
  constructor(private _dataBaseAccessor: DatabaseAccessor) {}

  public async getMODData(request: Request, response: Response) {
    const { start, end, flat } = request.query;
    try {
      let data: MODData;
      if (start && end) {
        data = await this._dataBaseAccessor.getMODDataInRange(`${start}`, `${end}`);
      } else {
        data = await this._dataBaseAccessor.getAllMODData();
      }
      const responseData = flat ? flattenMODData(data) : data;
      response.send(responseData);
    } catch (error) {
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
      const allMODData = await this._dataBaseAccessor.getAllOryxDataForCountry(`${country}`);
      response.send(allMODData);
    } catch (error) {
      response.status(500).send();
    }
  }
}
