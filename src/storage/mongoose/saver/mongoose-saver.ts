import { DataSaver } from '../../../_models/data-saver';
import { connectDataBase, disconnectDataBase } from '../mongoose';

export abstract class MongooseSaver<D> implements DataSaver<D> {
  protected abstract innerSave(data: D): Promise<void>;
  public async save(data: D): Promise<boolean> {
    await connectDataBase();
    try {
      await this.innerSave(data);
    } catch (e) {
      console.log((e as any).message);
    }
    await disconnectDataBase();
    return true;
  }
}
