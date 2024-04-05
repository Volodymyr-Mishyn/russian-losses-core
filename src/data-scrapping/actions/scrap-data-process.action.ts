import { ProcessRunner } from '../../process/process-runner';
import { Action, ActionExecutionResult } from '../../_models/action';
import { DataProcessor } from '../../_models/data-processor';
import { DataSaver } from '../../_models/data-saver';
import { Logger } from '../../_helpers/logger';

export class ScrapDataProcessAction implements Action {
  constructor(
    private _processRunner: ProcessRunner,
    private _dataProcessor: DataProcessor<unknown, unknown>,
    private _dataSaver: DataSaver<unknown>,
  ) {}
  public async execute(): Promise<ActionExecutionResult> {
    try {
      Logger.log('Scrap_Action: running process', '\x1b[36m');
      this._processRunner.run();
      const receivedData = await new Promise((resolve) => {
        this._processRunner.once('data', (data) => {
          Logger.log('Scrap_Action: Data parsed successfully', '\x1b[36m');
          resolve(data);
        });
      });
      Logger.log('Scrap_Action: proceeding to processing', '\x1b[36m');
      const processedData = await this._dataProcessor.process(receivedData);
      Logger.log('Scrap_Action: proceeding to saving', '\x1b[36m');
      await this._dataSaver.save(processedData);
      Logger.log('Scrap_Action: Save executed', '\x1b[36m');
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
