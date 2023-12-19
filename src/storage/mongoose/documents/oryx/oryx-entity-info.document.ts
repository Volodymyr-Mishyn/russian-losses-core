import { EntityInfo } from '../../../../_models/entities/oryx/oryx-model';

export interface OryxEntityInfoDocument extends EntityInfo, Document {
  code: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
