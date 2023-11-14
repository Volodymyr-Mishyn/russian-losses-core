import { DataProcessor } from '../../_models/data-processor';
import { MODDayResult, MODEntityLoss, MODScrapData } from '../../_models/scrapping/scrap-results/mod-scrap-data';
import { ScrapResult } from '../../_models/scrapping/scrap-results/scrap-result';
import { DayResult, EntityLoss, MODData } from '../../_models/entities/mod/mod-model';

const CASUALTY_NAMES = [
  'Tanks',
  'Armored fighting vehicle',
  'Artillery systems',
  'MLRS',
  'Anti-aircraft warfare',
  'Planes',
  'Helicopters',
  'UAV',
  'Cruise missiles',
  'Ships (boats)',
  'Submarines',
  'Cars and cisterns',
  'Special equipment',
  'Military personnel',
];

const LEGACY_NAME_MAPPINGS: { [oldName: string]: string } = {
  Cars: 'Cars and cisterns',
  'Cisterns with fuel': 'Cars and cisterns',
  'Mobile SRBM': 'MLRS',
  'MLRS Grad': 'MLRS',
  'BUK missile system': 'Anti-aircraft warfare',
};

const NAME_CODE_MAPPINGS: { [name: string]: string } = {
  Tanks: 'tank',
  'Armored fighting vehicle': 'armored_fighting_vehicle',
  'Artillery systems': 'artillery_system',
  MLRS: 'mlrs',
  'Anti-aircraft warfare': 'anti_aircraft',
  Planes: 'plane',
  Helicopters: 'helicopter',
  UAV: 'uav',
  'Cruise missiles': 'cruise_missile',
  'Ships (boats)': 'ship',
  Submarines: 'submarine',
  'Cars and cisterns': 'cars_cisterns',
  'Special equipment': 'special_equipment',
  'Military personnel': 'personnel',
};
export class MODDataProcessor implements DataProcessor<ScrapResult<MODScrapData>, MODData> {
  private _createCasualtiesMap(casualties: Array<MODEntityLoss>): Map<string, MODEntityLoss> {
    const casualtiesMap = new Map<string, MODEntityLoss>();
    casualties.forEach((previousDayEntity) => {
      casualtiesMap.set(previousDayEntity.name, previousDayEntity);
    });
    return casualtiesMap;
  }

  private _addCodeToCasualties(casualtyData: Array<MODEntityLoss>): Array<EntityLoss> {
    return casualtyData.map((casualty) => ({ ...casualty, code: NAME_CODE_MAPPINGS[casualty.name] }));
  }

  private _mergeCasualtiesWithSimilarNames(casualtyData: Array<MODEntityLoss>): Array<MODEntityLoss> {
    const mergedCasualtiesMap = new Map<string, MODEntityLoss>();

    casualtyData.forEach((casualtyInfo) => {
      const existingCasualty = mergedCasualtiesMap.get(casualtyInfo.name);
      if (existingCasualty) {
        mergedCasualtiesMap.set(casualtyInfo.name, {
          name: casualtyInfo.name,
          total: existingCasualty.total + casualtyInfo.total,
          increment: existingCasualty.increment + casualtyInfo.increment,
        });
      } else {
        mergedCasualtiesMap.set(casualtyInfo.name, {
          name: casualtyInfo.name,
          total: casualtyInfo.total,
          increment: casualtyInfo.increment,
        });
      }
    });

    return Array.from(mergedCasualtiesMap.values());
  }

  private _processDayResult(dayResult: MODDayResult, previousDayResult: MODDayResult): DayResult {
    const processedDayResult = { ...dayResult };
    const previousDayData: null | Map<string, MODEntityLoss> = previousDayResult
      ? this._createCasualtiesMap(previousDayResult.casualties)
      : null;

    processedDayResult.casualties = processedDayResult.casualties.map((casualtyInfo) => ({
      ...casualtyInfo,
      name: LEGACY_NAME_MAPPINGS[casualtyInfo.name] || casualtyInfo.name,
    }));
    const existingCasualtyNamesSet = new Set(processedDayResult.casualties.map((casualtyInfo) => casualtyInfo.name));
    const missingCasualtyNames = CASUALTY_NAMES.filter((name) => !existingCasualtyNamesSet.has(name));
    const missingCasualties: Array<MODEntityLoss> = missingCasualtyNames.map((casualtyName) => {
      const casualtyData: MODEntityLoss | null = previousDayData?.get(casualtyName) || null;
      return {
        name: casualtyName,
        total: casualtyData?.total || 0,
        increment: 0,
      };
    });
    const updatedCasualtiesWithAllFields = [...processedDayResult.casualties, ...missingCasualties];
    const mergedCasualties = this._mergeCasualtiesWithSimilarNames(updatedCasualtiesWithAllFields);
    const casualties = this._addCodeToCasualties(mergedCasualties);

    return {
      ...processedDayResult,
      date: new Date(dayResult.date),
      casualties,
    };
  }

  private async _processMODData(daysData: MODScrapData): Promise<MODData> {
    const processedData: MODData = [];
    daysData.forEach((currentDayData, index) => {
      const previousDayData = daysData[index - 1];
      const processedDayData = this._processDayResult(currentDayData, previousDayData);
      processedData.push(processedDayData);
    });
    return processedData;
  }

  public async process(data: ScrapResult<MODScrapData>): Promise<MODData> {
    const { data: daysData } = data.result;

    return this._processMODData(daysData);
  }
}
