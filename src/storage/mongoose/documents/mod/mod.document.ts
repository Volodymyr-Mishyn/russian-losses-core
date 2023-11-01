import { Document } from 'mongoose';
import { DayResult } from '../../../../_models/entities/mod/mod-model';

export interface MODDayDocument extends DayResult, Document {
  createdAt: Date;
  updatedAt: Date;
}
