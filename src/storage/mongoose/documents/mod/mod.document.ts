import { Document } from 'mongoose';
import { MoDDayResult } from '../../../../_models/entities/mod/mod-model';

export interface MoDDayDocument extends MoDDayResult, Document {
  createdAt: Date;
  updatedAt: Date;
}
