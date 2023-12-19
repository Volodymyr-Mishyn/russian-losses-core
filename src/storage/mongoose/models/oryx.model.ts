import mongoose, { Schema } from 'mongoose';
import { OryxEntityModelDocument } from '../documents/oryx/oryx-entity-model.document';
import { StorageNames } from '../../enums/storage-names.enum';
import { OryxEntityTypeDocument } from '../documents/oryx/oryx-entity-type.document';
import { OryxSideLossesDocument } from '../documents/oryx/oryx-side-losses.document';
import { OryxEntityInfoDocument } from '../documents/oryx/oryx-entity-info.document';

const OryxEntityInfoSchema = new Schema<OryxEntityInfoDocument>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    title: String,
    description: [String],
    images: [String],
    url: String,
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
    collection: `${StorageNames.ORYX}.entity-info`,
  },
);
OryxEntityInfoSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const OryxEntityInfoModel = mongoose.model<OryxEntityInfoDocument>('OryxEntityInfo', OryxEntityInfoSchema);

const OryxEntityModelSchema = new Schema<OryxEntityModelDocument>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    count: Number,
    countryName: { type: String, required: true },
    entityType: { type: String, required: true },
    info: {
      title: String,
      description: [String],
      images: [String],
      url: String,
    },
    destroyed: {
      count: Number,
      list: [String],
    },
    damaged: {
      count: Number,
      list: [String],
    },
    captured: {
      count: Number,
      list: [String],
    },
    abandoned: {
      count: Number,
      list: [String],
    },
    damagedAndCaptured: {
      count: Number,
      list: [String],
    },
    damagedAndAbandoned: {
      count: Number,
      list: [String],
    },
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
    collection: `${StorageNames.ORYX}.entities`,
  },
);
OryxEntityModelSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const OryxEntityModelModel = mongoose.model<OryxEntityModelDocument>('OryxEntityModel', OryxEntityModelSchema);

const OryxEntityTypeSchema = new Schema<OryxEntityTypeDocument>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    countryName: { type: String, required: true },
    statistics: {
      count: Number,
      destroyed: Number,
      damaged: Number,
      abandoned: Number,
      captured: Number,
    },
    entities: [{ type: Schema.Types.ObjectId, ref: 'OryxEntityModel' }],
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
    collection: `${StorageNames.ORYX}.entity-types`,
  },
);
OryxEntityTypeSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const OryxEntityTypeModel = mongoose.model<OryxEntityTypeDocument>('OryxEntityType', OryxEntityTypeSchema);

const OryxSideLossesSchema = new Schema<OryxSideLossesDocument>(
  {
    name: { type: String, required: true },
    countryName: { type: String, required: true },
    date: { type: Date, required: true },
    image: String,
    statistics: {
      count: Number,
      destroyed: Number,
      damaged: Number,
      abandoned: Number,
      captured: Number,
    },
    entityTypes: [{ type: Schema.Types.ObjectId, ref: 'OryxEntityType' }],
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
    collection: `${StorageNames.ORYX}`,
  },
);
OryxSideLossesSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const OryxSideLossesModel = mongoose.model<OryxSideLossesDocument>('OryxSideLosses', OryxSideLossesSchema);
