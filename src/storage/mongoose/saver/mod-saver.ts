import { MODData } from '../../../_models/entities/mod/mod-model';
import { DataSaver } from '../../../_models/data-saver';
import { MODModel } from '../models/mod.model';

export class MODSaver implements DataSaver<MODData> {
  async save(data: MODData): Promise<boolean> {
    for (const singleDayData of data) {
      try {
        console.log(singleDayData.date);
        const alreadyPresent = await MODModel.findOne({ date: singleDayData.date });
        if (alreadyPresent) {
          alreadyPresent.casualties = singleDayData.casualties;
          alreadyPresent.save();
        } else {
          const newData = new MODModel(singleDayData);
          newData.save();
        }
      } catch (e) {
        console.log((e as any).message);
        console.log(singleDayData);
      }
    }
    return true;
  }
}
