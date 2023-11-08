import { DataSaver } from '../../../_models/data-saver';
import { EstablishedDatabaseConnection } from '../mongoose-connector.decorator';
export abstract class MongooseSaver<D> implements DataSaver<D> {
  protected abstract innerSave(data: D): Promise<void>;
  @EstablishedDatabaseConnection({ instant: true })
  public async save(data: D): Promise<boolean> {
    try {
      await this.innerSave(data);
    } catch (e) {
      console.log((e as any).message);
    }
    return true;
  }
}
