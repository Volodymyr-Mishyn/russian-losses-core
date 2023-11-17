import mongoose, { Model, Schema } from 'mongoose';
import { MoDDayDocument } from '../documents/mod/mod.document';
import { StorageNames } from '../../enums/storage-names.enum';

export interface MoDDayModelModel extends Model<MoDDayDocument> {}

const MoDDaySchema = new Schema<MoDDayDocument>(
  {
    date: {
      type: Date,
      required: true,
    },
    casualties: [
      {
        name: String,
        code: String,
        total: Number,
        increment: Number,
      },
    ],
    createdAt: {
      type: Date,
      immutable: true,
      default: () => new Date(),
    },
    updatedAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    autoCreate: true,
    collection: StorageNames.MoD,
  },
);

MoDDaySchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const MoDModel = mongoose.model<MoDDayDocument>('MinistryOfDefenseStatistics', MoDDaySchema);
