import { DataSaver } from '../data-saver';
import { MoDDayResult, MoDData } from '../entities/mod/mod-model';
import { EntityType, OryxSideLosses } from '../entities/oryx/oryx-model';

export interface DatabaseAccessor {
  getMoDSaver(): DataSaver<MoDData>;
  getOryxSaver(): DataSaver<OryxSideLosses>;
  getIsMoDDataPresent(): Promise<boolean>;
  getIsOryxCountryDataPresent(countryName: string): Promise<boolean>;
  getAllMoDData(): Promise<MoDData>;
  getMoDDataInRange(startDate: string, endDate: string): Promise<MoDData>;
  getMoDDataForDay(startDate: string, endDate: string): Promise<MoDDayResult | null>;
  getAllOryxDataForCountry(countryName: string): Promise<OryxSideLosses>;
  getOryxDataForCountry(countryName: string): Promise<Omit<OryxSideLosses, 'entityTypes'>>;
  getOryxEntityTypesForCountry(countryName: string): Promise<Array<Omit<EntityType, 'entities'>>>;
  getOryxEntitiesByTypesForCountry(countryName: string, entityType: string): Promise<Array<unknown>>;
}
