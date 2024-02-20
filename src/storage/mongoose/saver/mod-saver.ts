import { Model } from 'mongoose';
import { MoDData } from '../../../_models/entities/mod/mod-model';
import { MoDModel } from '../models/mod.model';
import { MongooseSaver } from './mongoose-saver';
import { MoDDayDocument } from '../documents/mod/mod.document';
import { Logger } from '../../../_helpers/logger';
import { formatDate } from '../../../_helpers/date-utils';

export class MoDSaver extends MongooseSaver<MoDData> {
  constructor(private _MoDModel: Model<MoDDayDocument> = MoDModel) {
    super();
  }

  private async _saveMoDData(data: MoDData): Promise<void> {
    const updatedDates = [];
    const createdDates = [];
    for (const singleDayData of data) {
      const alreadyPresent = await this._MoDModel.findOne({ date: singleDayData.date });
      if (alreadyPresent) {
        alreadyPresent.casualties = singleDayData.casualties;
        await alreadyPresent.save();
        updatedDates.push(formatDate(singleDayData.date));
      } else {
        const newData = new this._MoDModel(singleDayData);
        await newData.save();
        createdDates.push(formatDate(singleDayData.date));
      }
    }
    if (updatedDates.length > 0) {
      Logger.log(`Mongoose Saver: updated MoD data for dates: ${updatedDates.join(', ')}`, '\x1b[32m');
    }
    if (createdDates.length > 0) {
      Logger.log(`Mongoose Saver: created MoD data for dates: ${createdDates.join(', ')}`, '\x1b[32m');
    }
  }

  protected async innerSave(data: MoDData): Promise<void> {
    Logger.log(`Mongoose Saver: saving MoD data ${data?.length} elements`, '\x1b[32m');
    await this._saveMoDData(data);
  }
}
