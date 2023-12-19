import { Types, Document } from 'mongoose';
import { EntityType } from '../../../../_models/entities/oryx/oryx-model';

export interface OryxEntityTypeDocument extends Omit<EntityType, 'entities'>, Document {
  entities: Array<Types.ObjectId>;
  createdAt: Date;
  updatedAt: Date;
}
