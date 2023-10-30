import { delay } from 'src/_helpers/delay';
import { DataProcessor } from '../_models/data-processor';
import { MODScrapData } from '../_models/scrapping/scrap-results/mod-scrap-data';
import { InnerScrapResult, ScrapResult } from '../_models/scrapping/scrap-results/scrap-result';

export class MODDataProcessor implements DataProcessor<ScrapResult<MODScrapData>, InnerScrapResult<MODScrapData>> {
  async process(data: ScrapResult<MODScrapData>): Promise<InnerScrapResult<MODScrapData>> {
    await delay(500);
    return data.result;
  }
}
