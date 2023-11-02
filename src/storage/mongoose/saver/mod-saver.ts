import { Model } from 'mongoose';
import { MODData } from '../../../_models/entities/mod/mod-model';
import { MODModel } from '../models/mod.model';
import { MongooseSaver } from './mongoose-saver';
import { MODDayDocument } from '../documents/mod/mod.document';

export class MODSaver extends MongooseSaver<MODData> {
  constructor(private _MODModel: Model<MODDayDocument> = MODModel) {
    super();
  }
  private async _saveMODData(data: MODData): Promise<void> {
    for (const singleDayData of data) {
      const alreadyPresent = await this._MODModel.findOne({ date: singleDayData.date });
      if (alreadyPresent) {
        alreadyPresent.casualties = singleDayData.casualties;
        await alreadyPresent.save();
      } else {
        const newData = new this._MODModel(singleDayData);
        await newData.save();
      }
    }
  }
  protected async innerSave(data: MODData): Promise<void> {
    await this._saveMODData(data);
  }
}
