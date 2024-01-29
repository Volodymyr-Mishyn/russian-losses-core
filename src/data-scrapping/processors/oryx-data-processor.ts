import { ScrapResult } from '../../_models/scrapping/scrap-results/scrap-result';
import { DataProcessor } from '../../_models/data-processor';
import {
  OryxDetailedEntity,
  OryxEntityType,
  OryxScrapData,
} from '../../_models/scrapping/scrap-results/oryx-scrap-data';
import { delay } from '../../_helpers/delay';
import { EntityModel, EntityType, OryxSideLosses } from '../../_models/entities/oryx/oryx-model';
import { OryxTypeNameMarshaller } from '../../_helpers/oryx-utils/oryx-type-name-marshaller';

export class OryxDataProcessor implements DataProcessor<ScrapResult<OryxScrapData>, OryxSideLosses> {
  private _createCodeForName(name: string): string {
    return OryxTypeNameMarshaller.getInstance().marshall(name);
  }

  private async _processEntityTypes(entities: OryxEntityType[], countryName: string): Promise<EntityType[]> {
    const processedEntitiesTypes: EntityType[] = [];
    for (const entityType of entities) {
      const processedEntities = await this._processSingleEntityType(entityType, countryName);
      const processedEntityType: EntityType = {
        ...entityType,
        code: this._createCodeForName(entityType.name),
        countryName: countryName,
        entities: processedEntities,
      };
      processedEntitiesTypes.push(processedEntityType);
    }
    return processedEntitiesTypes;
  }

  private async _processSingleEntityType(entityType: OryxEntityType, countryName: string): Promise<EntityModel[]> {
    const processedEntities: EntityModel[] = [];
    for (const singleEntity of entityType.details) {
      const processedEntity = await this._processSingleEntity(singleEntity, countryName, entityType.name);
      processedEntities.push(processedEntity);
    }
    return processedEntities;
  }

  private async _processSingleEntity(
    entity: OryxDetailedEntity,
    countryName: string,
    entityType: string,
  ): Promise<EntityModel> {
    const processedEntity: EntityModel = {
      ...entity,
      code: this._createCodeForName(entity.name),
      entityType: this._createCodeForName(entityType),
      countryName,
    };
    return processedEntity;
  }

  private _createOryxSideLosses(
    name: string,
    countryName: string,
    entityTypes: EntityType[],
    date: string,
    statistics: any,
  ): OryxSideLosses {
    return {
      name,
      countryName,
      entityTypes,
      date: new Date(date),
      statistics,
    };
  }

  public async process(data: ScrapResult<OryxScrapData>): Promise<OryxSideLosses> {
    await delay(500);
    const { data: initialData, date } = data.result;
    const { entities, name, statistics } = initialData;
    const countryName = name.toUpperCase();
    const processedEntitiesTypes = await this._processEntityTypes(entities, countryName);
    return this._createOryxSideLosses(name, countryName, processedEntitiesTypes, date, statistics);
  }
}
