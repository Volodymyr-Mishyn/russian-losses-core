import { DataSaver } from '../../../_models/data-saver';
import { connectDataBase, disconnectDataBase } from '../mongoose';
import { EntityModel, EntityType, OryxSideLosses } from '../../../_models/entities/oryx/oryx-model';
import { OryxEntityModelModel, OryxEntityTypeModel, OryxSideLossesModel } from '../models/oryx.model';
import { Types } from 'mongoose';

export class OryxSaver implements DataSaver<OryxSideLosses> {
  private async _insertEntities(entitiesData: Array<EntityModel>): Promise<Array<Types.ObjectId>> {
    const insertedEntityModels: Array<Types.ObjectId> = [];
    for (const entityData of entitiesData) {
      const { name, countryName, entityType } = entityData;
      const existingEntity = await OryxEntityModelModel.findOne({ name, countryName, entityType });
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
        const newEntity = new OryxEntityModelModel(entityData);
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
      const existingEntityType = await OryxEntityTypeModel.findOne({ name, countryName });
      if (existingEntityType) {
        const { statistics } = entityTypeData;
        existingEntityType.statistics = statistics;
        existingEntityType.entities = Array.from(savedEntitiesSet);
        await existingEntityType.save();
        insertedEntityTypeModels.push(existingEntityType._id);
      } else {
        const newEntityType = new OryxEntityTypeModel({
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
    let existingEntitySideLosses = await OryxSideLossesModel.findOne({ countryName, name });
    if (existingEntitySideLosses) {
      const { statistics } = data;
      existingEntitySideLosses.statistics = statistics;
      existingEntitySideLosses.entityTypes = Array.from(savedEntityTypesSet);
    } else {
      const newEntitySideLosses = new OryxSideLossesModel({ ...data, entityTypes: Array.from(savedEntityTypesSet) });
      await newEntitySideLosses.save();
    }
  }

  async save(data: OryxSideLosses): Promise<boolean> {
    await connectDataBase();
    try {
      await this._insertSideLosses(data);
    } catch (e) {
      console.log((e as any).message);
    }
    await disconnectDataBase();
    return true;
  }
}
