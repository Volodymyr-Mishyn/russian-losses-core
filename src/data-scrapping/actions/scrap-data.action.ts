import { ProcessRunner } from '../../process/process-runner';
import { Action, ActionExecutionResult } from '../../_models/action';
import { DataProcessor } from '../../_models/data-processor';
import { DataSaver } from '../../_models/data-saver';
import { Logger } from '../../_helpers/logger';

export class ScrapDataAction implements Action {
  constructor(
    private _processRunner: ProcessRunner,
    private _dataProcessor: DataProcessor<unknown, unknown>,
    private _dataSaver: DataSaver<unknown>,
  ) {}
  public async execute(): Promise<ActionExecutionResult> {
    try {
      this._processRunner.run();
      const receivedData = await new Promise((resolve) => {
        this._processRunner.once('data', (data) => {
          Logger.log('Data parsed successfully', '\x1b[36m');
          resolve(data);
        });
      });
      const processedData = await this._dataProcessor.process(receivedData);
      await this._dataSaver.save(processedData);
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
