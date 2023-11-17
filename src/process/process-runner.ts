import { spawn, ChildProcess } from 'child_process';
import { ProcessParameters } from '../_models/process/process-parameters';
import * as fs from 'fs';
import EventEmitter from 'events';

export class ProcessRunner extends EventEmitter {
  private _process: ChildProcess | null = null;
  private _processBufferLimit = 8192;

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
        this.emit(`data`, parsedData);
        processingFilteredResponse = false;
        filteredResponse = '';
        this.stop();
      } catch (error) {
        console.log('Error parsing JSON:', (error as any).message);
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

  private _createDebugFile(uniqueKey: string): fs.WriteStream {
    const date = new Date();
    const outputFile = fs.createWriteStream(`./debug/${uniqueKey}(${date.toUTCString()}).txt`);
    return outputFile;
  }

  private _setUpProcess(): void {
    const { runner, entryPath, flags, uniqueKey } = this._parameters;
    if (this._process) {
      console.log(`${entryPath} is already running.`);
      return;
    }
    this._process = spawn(runner, [entryPath, ...flags], { cwd: __dirname });
    this._process?.stdout?.pipe(this._createDebugFile(uniqueKey));
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
