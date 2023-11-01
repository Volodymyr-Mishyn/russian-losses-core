import { DataSaver } from '../../../_models/data-saver';
import { MongooseConnector } from '../mongoose-connector';

export abstract class MongooseSaver<D> implements DataSaver<D> {
  protected abstract innerSave(data: D): Promise<void>;
  public async save(data: D): Promise<boolean> {
    const connector = MongooseConnector.getInstance();
    await connector.connectDataBase();
    try {
      await this.innerSave(data);
    } catch (e) {
      console.log((e as any).message);
    }
    await connector.disconnectDataBase();
    return true;
  }
}
