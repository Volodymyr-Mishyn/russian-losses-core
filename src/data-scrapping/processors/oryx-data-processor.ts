import { ScrapResult } from '../../_models/scrapping/scrap-results/scrap-result';
import { DataProcessor } from '../../_models/data-processor';
import { OryxScrapData } from '../../_models/scrapping/scrap-results/oryx-scrap-data';
import { delay } from '../../_helpers/delay';
import { OryxSideLosses } from '../../_models/entities/oryx/oryx-model';

export class OryxDataProcessor implements DataProcessor<ScrapResult<OryxScrapData>, OryxSideLosses> {
  async process(data: ScrapResult<OryxScrapData>): Promise<OryxSideLosses> {
    await delay(500);
    const { data: initialData, date } = data.result;
    const { entities, name, statistics } = initialData;
    return { entities, name, date: new Date(date), statistics };
  }
}
