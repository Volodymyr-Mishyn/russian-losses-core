import { EntityModel, EntityType, OryxSideLosses } from '../../../_models/entities/oryx/oryx-model';
import { OryxEntityModelModel, OryxEntityTypeModel, OryxSideLossesModel } from '../models/oryx.model';
import { Model, Types } from 'mongoose';
import { MongooseSaver } from './mongoose-saver';
import { OryxSideLossesDocument } from '../documents/oryx/oryx-side-losses.document';
import { OryxEntityTypeDocument } from '../documents/oryx/oryx-entity-type.document';
import { OryxEntityModelDocument } from '../documents/oryx/oryx-entity-model.document';

export class OryxSaver extends MongooseSaver<OryxSideLosses> {
  constructor(
    private _oryxSideLossesModel: Model<OryxSideLossesDocument> = OryxSideLossesModel,
    private _oryxEntityTypeModel: Model<OryxEntityTypeDocument> = OryxEntityTypeModel,
    private _oryxEntityModelModel: Model<OryxEntityModelDocument> = OryxEntityModelModel,
  ) {
    super();
  }
  private async _insertEntities(entitiesData: Array<EntityModel>): Promise<Array<Types.ObjectId>> {
    const insertedEntityModels: Array<Types.ObjectId> = [];
    for (const entityData of entitiesData) {
      const { name, countryName, entityType } = entityData;
      const existingEntity = await this._oryxEntityModelModel.findOne({ name, countryName, entityType });
      if (existingEntity) {
        const { count, abandoned, captured, damaged, destroyed, damagedAndCaptured, damagedAndAbandoned } = entityData;
        existingEntity.count = count;
        existingEntity.abandoned = abandoned;
        existingEntity.captured = captured;
        existingEntity.damaged = damaged;
        existingEntity.destroyed = destroyed;
        existingEntity.damagedAndCaptured = damagedAndCaptured;
        existingEntity.damagedAndAbandoned = damagedAndAbandoned;
        await existingEntity.save();
        insertedEntityModels.push(existingEntity._id);
      } else {
        const newEntity = new this._oryxEntityModelModel(entityData);
        await newEntity.save();
        insertedEntityModels.push(newEntity._id);
      }
    }
    return insertedEntityModels;
  }

  private async _insertEntityTypes(entityTypesData: Array<EntityType>): Promise<Array<Types.ObjectId>> {
    const insertedEntityTypeModels = [];
    for (const entityTypeData of entityTypesData) {
      const { name, countryName, entities } = entityTypeData;
      const savedEntities = await this._insertEntities(entities);
      const savedEntitiesSet = new Set([...savedEntities]);
      const existingEntityType = await this._oryxEntityTypeModel.findOne({ name, countryName });
      if (existingEntityType) {
        const { statistics } = entityTypeData;
        existingEntityType.statistics = statistics;
        existingEntityType.entities = Array.from(savedEntitiesSet);
        await existingEntityType.save();
        insertedEntityTypeModels.push(existingEntityType._id);
      } else {
        const newEntityType = new this._oryxEntityTypeModel({
          ...entityTypeData,
          entities: Array.from(savedEntitiesSet),
        });
        await newEntityType.save();
        insertedEntityTypeModels.push(newEntityType._id);
      }
    }
    return insertedEntityTypeModels;
  }

  private async _insertSideLosses(data: OryxSideLosses): Promise<void> {
    const { entityTypes, countryName, name } = data;
    const savedEntityTypes = await this._insertEntityTypes(entityTypes);
    const savedEntityTypesSet = new Set([...savedEntityTypes]);
    let existingEntitySideLosses = await this._oryxSideLossesModel.findOne({ countryName, name });
    if (existingEntitySideLosses) {
      const { statistics } = data;
      existingEntitySideLosses.statistics = statistics;
      existingEntitySideLosses.entityTypes = Array.from(savedEntityTypesSet);
      await existingEntitySideLosses.save();
    } else {
      const newEntitySideLosses = new this._oryxSideLossesModel({
        ...data,
        entityTypes: Array.from(savedEntityTypesSet),
      });
      await newEntitySideLosses.save();
    }
  }

  protected async innerSave(data: OryxSideLosses): Promise<void> {
    await this._insertSideLosses(data);
  }
}
