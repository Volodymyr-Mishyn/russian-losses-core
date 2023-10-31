import { delay } from '../../_helpers/delay';
import { DataProcessor } from '../../_models/data-processor';
import { MODScrapData } from '../../_models/scrapping/scrap-results/mod-scrap-data';
import { ScrapResult } from '../../_models/scrapping/scrap-results/scrap-result';
import { MODData } from '../../_models/entities/mod/mod-model';

export class MODDataProcessor implements DataProcessor<ScrapResult<MODScrapData>, MODData> {
  async process(data: ScrapResult<MODScrapData>): Promise<MODData> {
    await delay(500);
    const { data: daysData } = data.result;
    const processedData: MODData = daysData.map((dayData) => {
      return {
        date: new Date(dayData.date),
        casualties: dayData.casualties,
      };
    });
    return processedData;
  }
}
