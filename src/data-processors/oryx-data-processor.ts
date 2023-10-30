import { InnerScrapResult, ScrapResult } from '../_models/scrapping/scrap-results/scrap-result';
import { DataProcessor } from '../_models/data-processor';
import { OryxScrapData } from '../_models/scrapping/scrap-results/oryx-scrap-data';
import { delay } from '../_helpers/delay';

export class OryxDataProcessor implements DataProcessor<ScrapResult<OryxScrapData>, InnerScrapResult<OryxScrapData>> {
  async process(data: ScrapResult<OryxScrapData>): Promise<InnerScrapResult<OryxScrapData>> {
    await delay(500);
    return data.result;
  }
}
