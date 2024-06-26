import { StartParameters, runScraper } from 'russian-losses-scrapper';

import { Action, ActionExecutionResult } from '../../_models/action';
import { DataProcessor } from '../../_models/data-processor';
import { DataSaver } from '../../_models/data-saver';
import { Logger } from '../../_helpers/logger';
import { ScrapperStartParameters } from '../../_models/scrapping/scrapping-parameters';

export class ScrapDataAction implements Action {
  constructor(
    private _dataProcessor: DataProcessor<unknown, unknown>,
    private _dataSaver: DataSaver<unknown>,
    private _scrapParams: ScrapperStartParameters,
  ) {}

  public async execute(): Promise<ActionExecutionResult> {
    try {
      Logger.log('Scrap_Action(library): running ', '\x1b[36m');
      const receivedData = await runScraper(this._scrapParams as unknown as StartParameters);
      Logger.log('Scrap_Action(library): proceeding to processing', '\x1b[36m');
      const processedData = await this._dataProcessor.process(receivedData);
      Logger.log('Scrap_Action(library): proceeding to saving', '\x1b[36m');
      await this._dataSaver.save(processedData);
      Logger.log('Scrap_Action(library): Save executed', '\x1b[36m');
      return {
        status: true,
      };
    } catch (e) {
      Logger.log(`ERROR! : ${(e as any).message}`);
      return {
        status: false,
      };
    }
  }
}
