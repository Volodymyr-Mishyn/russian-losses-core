import { Model } from 'mongoose';
import { MoDData } from '../../../_models/entities/mod/mod-model';
import { MoDModel } from '../models/mod.model';
import { MongooseSaver } from './mongoose-saver';
import { MoDDayDocument } from '../documents/mod/mod.document';

export class MoDSaver extends MongooseSaver<MoDData> {
  constructor(private _MoDModel: Model<MoDDayDocument> = MoDModel) {
    super();
  }

  private async _saveMoDData(data: MoDData): Promise<void> {
    for (const singleDayData of data) {
      const alreadyPresent = await this._MoDModel.findOne({ date: singleDayData.date });
      if (alreadyPresent) {
        alreadyPresent.casualties = singleDayData.casualties;
        await alreadyPresent.save();
      } else {
        const newData = new this._MoDModel(singleDayData);
        await newData.save();
      }
    }
  }

  protected async innerSave(data: MoDData): Promise<void> {
    await this._saveMoDData(data);
  }
}
