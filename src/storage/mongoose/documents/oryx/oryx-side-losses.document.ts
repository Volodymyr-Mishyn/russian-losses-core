import { Types } from 'mongoose';
import { OryxSideLosses } from '../../../../_models/entities/oryx/oryx-model';

export interface OryxSideLossesDocument extends Omit<OryxSideLosses, 'entityTypes'>, Document {
  entityTypes: Array<Types.ObjectId>;
  createdAt: Date;
  updatedAt: Date;
}
