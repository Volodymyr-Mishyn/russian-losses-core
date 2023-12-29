import { spawn, ChildProcess } from 'child_process';
import { ProcessParameters } from '../_models/process/process-parameters';
import * as fs from 'fs';
import EventEmitter from 'events';
import { Logger } from '../_helpers/logger';

export class ProcessRunner extends EventEmitter {
  private _process: ChildProcess | null = null;

  constructor(private _parameters: ProcessParameters) {
    super();
  }

  private _setUpProcessEvents(): void {
    if (!this._process) {
      return;
    }
    const { entryPath, uniqueKey } = this._parameters;
    let filteredResponse = '';
    let processingFilteredResponse = false;
    this._process.stdout?.on('data', async (data) => {
      Logger.log(`Process Runner: ${entryPath} chunk of data received`);
      const output: string = data.toString();
      if (output.includes(uniqueKey)) {
        Logger.log(`Process Runner: ${uniqueKey} Starting to process response`);
        filteredResponse = output;
        processingFilteredResponse = true;
      } else if (processingFilteredResponse) {
        filteredResponse += output;
      }
      if (!processingFilteredResponse) {
        return;
      }
      try {
        Logger.log(`Process Runner: ${entryPath} Trying to parse JSON`);
        const parsedData = JSON.parse(filteredResponse)[uniqueKey];
        this.emit(`data`, parsedData);
        Logger.log(`Process Runner: ${entryPath} SUCCESS. Emitting data upwards`);
        processingFilteredResponse = false;
        filteredResponse = '';
        this.stop();
      } catch (error) {
        Logger.log(`Process Runner (ERROR): Error parsing JSON '${(error as any).message}'`);
      }
    });

    this._process.on('exit', (code) => {
      Logger.log(`Process Runner: ${entryPath} exited with code ${code}`);
      this.stop();
    });

    this._process.on('error', (err) => {
      Logger.log(`Process Runner (ERROR): process error '${err}'`);
      this.stop();
    });
  }

  private _createDebugFile(uniqueKey: string): fs.WriteStream {
    const date = new Date();
    const outputFile = fs.createWriteStream(`./debug/${uniqueKey}(${date.toUTCString()}).txt`);
    return outputFile;
  }

  private _setUpProcess(): void {
    const { runner, entryPath, flags, uniqueKey } = this._parameters;
    if (this._process) {
      Logger.log(`Process Runner (ERROR): ${entryPath} is already running.`);
      return;
    }
    this._process = spawn(runner, [entryPath, ...flags], { cwd: __dirname });
    Logger.log(`Process Runner: ${entryPath} successfully spawned!`);
    this._process?.stdout?.pipe(this._createDebugFile(uniqueKey));
    this._process?.stdout?.setEncoding('utf8');
  }

  public run(): void {
    Logger.log(`Process Runner: Running process with parameters ${this._parameters.flags}`);
    this._setUpProcess();
    this._setUpProcessEvents();
  }

  public stop(): void {
    if (this._process) {
      this._process.kill();
      this._process = null;
    }
  }
}
