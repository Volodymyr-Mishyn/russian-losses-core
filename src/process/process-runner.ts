import { spawn, ChildProcess, fork } from 'child_process';
import { ProcessParameters } from '../_models/process/process-parameters';
import * as fs from 'fs';
import { ProcessHandler } from '../_models/process/process-handler';

export class ProcessRunner {
  private _process: ChildProcess | null = null;
  private _processBufferLimit = 8192;

  constructor(
    private _parameters: ProcessParameters,
    private _processHandler: ProcessHandler,
  ) {}

  private _setUpProcessEvents(): void {
    if (!this._process) {
      return;
    }
    const { entryPath, uniqueKey } = this._parameters;
    let filteredResponse = '';
    let processingFilteredResponse = false;
    this._process.stdout?.on('data', async (data) => {
      const output: string = data.toString();
      const chunkSize = output.length;
      if (output.includes(uniqueKey)) {
        filteredResponse = output;
        processingFilteredResponse = true;
      } else if (processingFilteredResponse) {
        filteredResponse += output;
      }
      if (processingFilteredResponse && chunkSize >= this._processBufferLimit) {
        return;
      }
      if (!processingFilteredResponse) {
        return;
      }
      try {
        const parsedData = JSON.parse(filteredResponse)[uniqueKey];
        await this._processHandler.handle(parsedData);
        processingFilteredResponse = false;
        filteredResponse = '';
        this.stop();
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    });

    this._process.on('exit', (code) => {
      console.log(`${entryPath} exited with code ${code}`);
      this._process = null;
    });

    this._process.on('error', (err) => {
      console.error('Error:', err);
    });
  }

  private _setUpProcess() {
    const { runner, entryPath, flags, uniqueKey } = this._parameters;
    if (this._process) {
      console.log(`${entryPath} is already running.`);
      return;
    }
    this._process = spawn(runner, [entryPath, ...flags], { cwd: __dirname });
    const outputFile = fs.createWriteStream(`./debug/${uniqueKey}.txt`);
    this._process?.stdout?.pipe(outputFile);
    this._process?.stdout?.setEncoding('utf8');
  }

  public run(): void {
    this._setUpProcess();
    this._setUpProcessEvents();
  }

  public stop(): void {
    if (this._process) {
      this._process.kill();
    }
  }
}
