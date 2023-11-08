import { Request, Response } from 'express';
import { DatabaseAccessor } from '../../_models/storage/database-accessor';

export class DataController {
  constructor(private _dataBaseAccessor: DatabaseAccessor) {}

  private async _getAllMODData(request: Request, response: Response) {
    try {
      const allMODData = await this._dataBaseAccessor.getAllMODData();
      response.send(allMODData);
    } catch (error) {
      response.status(500).send();
    }
  }

  private async _getMODDataInRange(request: Request, response: Response) {
    const { start, end } = request.query;
    try {
      const data = await this._dataBaseAccessor.getMODDataInRange(`${start}`, `${end}`);
      response.send(data);
    } catch (error) {
      response.status(500).send();
    }
  }

  public async getMODData(request: Request, response: Response) {
    const { start, end } = request.query;
    if (start && end) {
      return this._getMODDataInRange(request, response);
    }
    return this._getAllMODData(request, response);
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
