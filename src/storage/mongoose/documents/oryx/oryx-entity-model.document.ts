import { EntityModel } from '../../../../_models/entities/oryx/oryx-model';

export interface OryxEntityModelDocument extends EntityModel, Document {
  createdAt: Date;
  updatedAt: Date;
}
