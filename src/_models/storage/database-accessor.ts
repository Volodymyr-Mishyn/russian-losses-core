import { DataSaver } from '../data-saver';
import { DayResult, MODData } from '../entities/mod/mod-model';
import { EntityType, OryxSideLosses } from '../entities/oryx/oryx-model';

export interface DatabaseAccessor {
  getMODSaver(): DataSaver<MODData>;
  getOryxSaver(): DataSaver<OryxSideLosses>;
  getAllMODData(): Promise<MODData>;
  getMODDataInRange(startDate: string, endDate: string): Promise<MODData>;
  getMODDataForDay(startDate: string, endDate: string): Promise<DayResult | null>;
  getAllOryxDataForCountry(countryName: string): Promise<OryxSideLosses>;
  getOryxDataForCountry(countryName: string): Promise<Omit<OryxSideLosses, 'entityTypes'>>;
  getOryxEntityTypesForCountry(countryName: string): Promise<Array<Omit<EntityType, 'entities'>>>;
  getOryxEntitiesByTypesForCountry(countryName: string, entityType: string): Promise<Array<unknown>>;
}
