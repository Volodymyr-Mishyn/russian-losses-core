import mongoose, { Model, Schema } from 'mongoose';
import { MODDayDocument } from '../documents/mod/mod.document';
import { StorageNames } from '../../enums/storage-names.enum';

export interface MODDayModelModel extends Model<MODDayDocument> {}

const MODDaySchema = new Schema<MODDayDocument>(
  {
    date: {
      type: Date,
      required: true,
    },
    casualties: [
      {
        name: String,
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
    collection: StorageNames.MOD,
  },
);

MODDaySchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const MODModel = mongoose.model<MODDayDocument>('MinistryOfDefenseStatistics', MODDaySchema);
