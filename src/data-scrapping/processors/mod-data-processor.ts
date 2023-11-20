import { DataProcessor } from '../../_models/data-processor';
import {
  MoDScrapDayResult,
  MoDScrapEntityLoss,
  MoDScrapData,
} from '../../_models/scrapping/scrap-results/mod-scrap-data';
import { ScrapResult } from '../../_models/scrapping/scrap-results/scrap-result';
import { MoDDayResult, MoDEntityLoss, MoDData } from '../../_models/entities/mod/mod-model';
import {
  DATE_OF_INVASION,
  DATE_OF_INVASION_INSTANCE,
  MONTH_OF_INVASION,
  YEAR_OF_INVASION,
} from '../../_constants/russian-invasion-date';
import { CASUALTY_NAMES, LEGACY_NAME_MAPPINGS, NAME_CODE_MAPPINGS } from '../../_constants/mod-names';

const MS_TO_DAYS = 1000 * 60 * 60 * 24;
export class MoDDataProcessor implements DataProcessor<ScrapResult<MoDScrapData>, MoDData> {
  constructor(private _initialProcessing = false) {}
  private _calculateDayOfInvasion(date: Date): number {
    const timeDifference = date.getTime() - DATE_OF_INVASION_INSTANCE.getTime();
    return Math.floor(timeDifference / MS_TO_DAYS);
  }

  private _createCasualtiesMap(casualties: Array<MoDEntityLoss>): Map<string, MoDEntityLoss> {
    const casualtiesMap = new Map<string, MoDEntityLoss>();
    casualties.forEach((previousDayEntity) => {
      casualtiesMap.set(previousDayEntity.name, previousDayEntity);
    });
    return casualtiesMap;
  }

  private _createDateDataMap(daysResults: MoDData): Map<string, MoDDayResult> {
    const dayDataMap = new Map<string, MoDDayResult>();
    daysResults.forEach((dayData) => {
      dayDataMap.set(dayData.date.toISOString(), dayData);
    });
    return dayDataMap;
  }

  private _fixIncrementsForFirstDay(dayData: MoDDayResult): MoDDayResult {
    const date = dayData.date;
    if (
      date.getDate() !== DATE_OF_INVASION ||
      date.getMonth() !== MONTH_OF_INVASION ||
      date.getFullYear() !== YEAR_OF_INVASION
    ) {
      return dayData;
    }
    return {
      ...dayData,
      casualties: dayData.casualties.map((casualty) => {
        if (casualty.total > 0 && casualty.increment === 0) {
          return { ...casualty, increment: casualty.total };
        }
        return casualty;
      }),
    };
  }

  private _addAdditionalDataToCasualties(casualtyData: Array<MoDScrapEntityLoss>): Array<MoDEntityLoss> {
    return casualtyData.map((casualty) => {
      const updatedData: MoDEntityLoss = { ...casualty, code: NAME_CODE_MAPPINGS[casualty.name] };
      if (casualty.increment < 0) {
        updatedData.correction = true;
      }
      return updatedData;
    });
  }

  private _mergeCasualtiesWithSimilarNames(casualtyData: Array<MoDScrapEntityLoss>): Array<MoDScrapEntityLoss> {
    const mergedCasualtiesMap = new Map<string, MoDScrapEntityLoss>();
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

  private _updateCasualtiesWithPreviousDayData(
    casualtyData: Array<MoDEntityLoss>,
    previousDayData: Map<string, MoDEntityLoss>,
  ): Array<MoDEntityLoss> {
    return casualtyData.map((currentDayCasualtyData) => {
      const previousDayCasualtyData: MoDEntityLoss | null = previousDayData?.get(currentDayCasualtyData.name) || null;
      if (previousDayCasualtyData) {
        const actualIncrement = currentDayCasualtyData.total - previousDayCasualtyData.total;
        if (actualIncrement < 0 && !currentDayCasualtyData.correction) {
          return {
            ...currentDayCasualtyData,
            total: previousDayCasualtyData.total,
            increment: 0,
          };
        }
        if (actualIncrement > currentDayCasualtyData.increment) {
          return {
            ...currentDayCasualtyData,
            increment: actualIncrement,
          };
        }
      }
      return currentDayCasualtyData;
    });
  }

  private _updateDayWithPreviousDay(dayResult: MoDDayResult, previousDayResult: MoDDayResult): MoDDayResult {
    const processedDayResult = { ...dayResult };
    const previousDayDataMap: Map<string, MoDEntityLoss> = this._createCasualtiesMap(previousDayResult.casualties);
    return {
      ...processedDayResult,
      casualties: this._updateCasualtiesWithPreviousDayData(processedDayResult.casualties, previousDayDataMap),
    };
  }

  private _formatDayScrapResult(dayResult: MoDScrapDayResult): MoDDayResult {
    const processedDayResult = { ...dayResult };
    processedDayResult.casualties = processedDayResult.casualties.map((casualtyInfo) => ({
      ...casualtyInfo,
      name: LEGACY_NAME_MAPPINGS[casualtyInfo.name] || casualtyInfo.name,
    }));
    const existingCasualtyNamesSet = new Set(processedDayResult.casualties.map((casualtyInfo) => casualtyInfo.name));
    const missingCasualtyNames = CASUALTY_NAMES.filter((name) => !existingCasualtyNamesSet.has(name));
    const missingCasualties: Array<MoDScrapEntityLoss> = missingCasualtyNames.map((casualtyName) => ({
      name: casualtyName,
      total: 0,
      increment: 0,
    }));
    const casualties = this._addAdditionalDataToCasualties(
      this._mergeCasualtiesWithSimilarNames([...processedDayResult.casualties, ...missingCasualties]),
    );
    const currentDate = new Date(dayResult.date);
    return {
      ...processedDayResult,
      date: currentDate,
      dayOfInvasion: this._calculateDayOfInvasion(currentDate),
      casualties,
    };
  }

  private async _processMoDData(daysData: MoDScrapData): Promise<MoDData> {
    const formattedData = daysData.map((currentDayData) => this._formatDayScrapResult(currentDayData));
    const dayDataMap = this._createDateDataMap(formattedData);
    return formattedData.map((currentDayData) => {
      const oneDayBefore = new Date(currentDayData.date);
      oneDayBefore.setDate(currentDayData.date.getDate() - 1);
      const previousDayData = dayDataMap.get(oneDayBefore.toISOString());
      if (previousDayData) {
        return this._updateDayWithPreviousDay(currentDayData, previousDayData);
      } else if (this._initialProcessing) {
        return this._fixIncrementsForFirstDay(currentDayData);
      }
      return currentDayData;
    });
  }

  public async process(data: ScrapResult<MoDScrapData>): Promise<MoDData> {
    const { data: daysData } = data.result;
    return this._processMoDData(daysData);
  }
}
