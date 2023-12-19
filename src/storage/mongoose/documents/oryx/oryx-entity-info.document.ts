import { EntityInfo } from '../../../../_models/entities/oryx/oryx-model';

export interface OryxEntityInfoDocument extends EntityInfo, Document {
  createdAt: Date;
  updatedAt: Date;
}
