require('dotenv').config();
import { spawn, ChildProcess } from 'child_process';
import { ProcessParameters } from '../_models/process/process-parameters';
import * as fs from 'fs';
import EventEmitter from 'events';
import { Logger } from '../_helpers/logger';
import path from 'path';

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
      const output: string = data.toString();
      Logger.log(`Process Runner: ${uniqueKey} chunk of data received. DATA: ${output.slice(0, 100)}...`);
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
        Logger.log(`Process Runner: ${uniqueKey} Trying to parse JSON`);
        const parsedData = JSON.parse(filteredResponse)[uniqueKey];
        Logger.log(`Process Runner: ${uniqueKey} SUCCESS. Emitting data upwards`);
        this.emit(`data`, parsedData);
        processingFilteredResponse = false;
        filteredResponse = '';
        this.stop();
      } catch (error) {
        Logger.log(`Process Runner (ERROR): Error parsing JSON '${(error as any).message}'`);
      }
    });

    this._process.on('exit', (code) => {
      Logger.log(`Process Runner: ${uniqueKey} exited with code ${code}`);
      this.stop();
    });

    this._process.on('error', (err) => {
      Logger.log(`Process Runner (ERROR): process error '${err}'`);
      this.stop();
    });
  }

  private _createDebugFile(uniqueKey: string): fs.WriteStream {
    const directory = './debug';
    const date = new Date();
    const fileName = `${uniqueKey}(${date.toUTCString()}).txt`;
    const filePath = path.join(directory, fileName);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    const outputFile = fs.createWriteStream(filePath);
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
    this._process = spawn(runner, [entryPath, ...flags], {
      cwd: __dirname,
      env: { ...process.env, NODE_ENV: process.env.NODE_ENV },
    });
    Logger.log(`Process Runner: ${entryPath} successfully spawned in ${process.env.NODE_ENV} mode!`);
    if (process.env.NODE_ENV !== 'production') {
      this._process?.stdout?.pipe(this._createDebugFile(uniqueKey));
      this._process?.stdout?.setEncoding('utf8');
    }
  }

  public run(): void {
    Logger.log(`Process Runner: Running process with parameters ${this._parameters.flags}`);
    try {
      this._setUpProcess();
      this._setUpProcessEvents();
    } catch (e) {
      Logger.log(`Process Runner ERROR (Setup process): ${JSON.stringify(e)}`);
    }
  }

  public stop(): void {
    if (this._process) {
      this._process.kill();
      this._process = null;
    }
  }
}
