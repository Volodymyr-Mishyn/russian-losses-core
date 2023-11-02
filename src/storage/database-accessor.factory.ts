import { DatabaseAccessor } from '../_models/storage/database-accessor';
import { MongooseAccessor } from './mongoose/mongoose-accessor';

export class DatabaseAccessorFactory {
  static create(type: string): DatabaseAccessor {
    if (type === 'mongodb') {
      return new MongooseAccessor();
    }
    throw new Error(`Database "${type}" is not supported!`);
  }
}
