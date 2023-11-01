import { MODData } from '../../../_models/entities/mod/mod-model';
import { MODModel } from '../models/mod.model';
import { MongooseSaver } from './mongoose-saver';

export class MODSaver extends MongooseSaver<MODData> {
  private async _saveMODData(data: MODData): Promise<void> {
    for (const singleDayData of data) {
      const alreadyPresent = await MODModel.findOne({ date: singleDayData.date });
      if (alreadyPresent) {
        alreadyPresent.casualties = singleDayData.casualties;
        await alreadyPresent.save();
      } else {
        const newData = new MODModel(singleDayData);
        await newData.save();
      }
    }
  }
  protected async innerSave(data: MODData): Promise<void> {
    await this._saveMODData(data);
  }
}
