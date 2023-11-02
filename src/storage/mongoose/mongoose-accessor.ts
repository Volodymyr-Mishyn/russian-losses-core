import { Model } from 'mongoose';
import { DataSaver } from '../../_models/data-saver';
import { MODData, DayResult } from '../../_models/entities/mod/mod-model';
import { OryxSideLosses, EntityType } from '../../_models/entities/oryx/oryx-model';
import { DatabaseAccessor } from '../../_models/storage/database-accessor';
import { MODSaver } from './saver/mod-saver';
import { OryxSaver } from './saver/oryx-saver';
import { OryxSideLossesDocument } from './documents/oryx/oryx-side-losses.document';
import { OryxEntityModelModel, OryxEntityTypeModel, OryxSideLossesModel } from './models/oryx.model';
import { OryxEntityTypeDocument } from './documents/oryx/oryx-entity-type.document';
import { OryxEntityModelDocument } from './documents/oryx/oryx-entity-model.document';
import { MongooseConnector } from './mongoose-connector';
import { MODModel } from './models/mod.model';
import { MODDayDocument } from './documents/mod/mod.document';

export class MongooseAccessor implements DatabaseAccessor {
  private _modSaver = new MODSaver();
  private _oryxSaver = new OryxSaver();
  private _connector = MongooseConnector.getInstance();

  constructor(
    private _MODModel: Model<MODDayDocument> = MODModel,
    private _oryxSideLossesModel: Model<OryxSideLossesDocument> = OryxSideLossesModel,
    private _oryxEntityTypeModel: Model<OryxEntityTypeDocument> = OryxEntityTypeModel,
    private _oryxEntityModelModel: Model<OryxEntityModelDocument> = OryxEntityModelModel,
  ) {
    this._connector.connectDataBase();
  }

  public getMODSaver(): DataSaver<MODData> {
    return this._modSaver;
  }

  public getOryxSaver(): DataSaver<OryxSideLosses> {
    return this._oryxSaver;
  }

  public async getAllMODData(): Promise<MODData> {
    return this._MODModel.find({}).exec();
  }

  public async getMODDataInRange(startDate: string, endDate: string): Promise<MODData> {
    return this._MODModel
      .find({
        date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      })
      .exec();
  }

  public async getMODDataForDay(date: string): Promise<DayResult | null> {
    return this._MODModel.findOne({ date: new Date(date) }).exec();
  }

  public async getAllOryxDataForCountry(countryName: string): Promise<OryxSideLosses> {
    const oryxSideLosses = (await this._oryxSideLossesModel
      .findOne({ countryName: countryName.toUpperCase() })
      .populate('entityTypes')
      .populate('entityTypes.entities')
      .exec()) as unknown as Promise<OryxSideLosses>;
    this._connector.scheduleDisconnect();
    return oryxSideLosses;
  }

  public async getOryxDataForCountry(countryName: string): Promise<Omit<OryxSideLosses, 'entityTypes'>> {
    const oryxSideLosses = (await this._oryxSideLossesModel
      .findOne({ countryName: countryName.toUpperCase() })
      .select('-entityTypes')
      .exec()) as unknown as Promise<Omit<OryxSideLosses, 'entityTypes'>>;
    this._connector.scheduleDisconnect();
    return oryxSideLosses;
  }

  public async getOryxEntityTypesForCountry(countryName: string): Promise<Omit<EntityType, 'entities'>[]> {
    return this._oryxEntityTypeModel.find({ countryName: countryName.toUpperCase() }).select('-entities').exec();
  }

  public async getOryxEntitiesByTypesForCountry(countryName: string, entityType: string): Promise<unknown[]> {
    return this._oryxEntityModelModel.find({ countryName: countryName.toUpperCase(), entityType }).exec();
  }
}
