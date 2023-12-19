import { Logger } from '../../../_helpers/logger';
import { DataSaver } from '../../../_models/data-saver';
import { EstablishedDatabaseConnection } from '../mongoose-connector.decorator';
export abstract class MongooseSaver<D> implements DataSaver<D> {
  protected abstract innerSave(data: D): Promise<void>;
  @EstablishedDatabaseConnection({ disconnectTime: 240000 })
  public async save(data: D): Promise<boolean> {
    try {
      await this.innerSave(data);
    } catch (e) {
      Logger.log(`Mongoose Saver (ERROR): ${(e as any).message}`, '\x1b[32m');
    }
    return true;
  }
}
