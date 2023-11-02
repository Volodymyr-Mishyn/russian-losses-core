import { ProcessRunner } from '../../process/process-runner';
import { Action, ActionExecutionResult } from '../../_models/action';
import { DataProcessor } from '../../_models/data-processor';
import { DataSaver } from 'src/_models/data-saver';

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
          console.log('\x1b[36m%s\x1b[0m', 'Data parsed successfully');
          resolve(data);
        });
      });
      const processedData = await this._dataProcessor.process(receivedData);
      await this._dataSaver.save(processedData);
      return {
        status: true,
      };
    } catch (e) {
      console.log((e as any).message);
      return {
        status: false,
      };
    }
  }
}
