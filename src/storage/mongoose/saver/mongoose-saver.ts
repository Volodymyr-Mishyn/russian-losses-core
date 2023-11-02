import { DataSaver } from '../../../_models/data-saver';
import { MongooseConnector } from '../mongoose-connector';

export abstract class MongooseSaver<D> implements DataSaver<D> {
  private _connector = MongooseConnector.getInstance();
  protected abstract innerSave(data: D): Promise<void>;
  public async save(data: D): Promise<boolean> {
    await this._connector.connectDataBase();
    try {
      await this.innerSave(data);
    } catch (e) {
      console.log((e as any).message);
    }
    await this._connector.disconnectDataBase();
    return true;
  }
}
