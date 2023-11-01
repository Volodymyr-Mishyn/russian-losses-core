import { MODData } from '../../../_models/entities/mod/mod-model';
import { DataSaver } from '../../../_models/data-saver';
import { MODModel } from '../models/mod.model';
import { connectDataBase, disconnectDataBase } from '../mongoose';

export class MODSaver implements DataSaver<MODData> {
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
  async save(data: MODData): Promise<boolean> {
    await connectDataBase();
    try {
      await this._saveMODData(data);
    } catch (e) {
      console.log((e as any).message);
    }
    await disconnectDataBase();
    return true;
  }
}
