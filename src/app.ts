import path from 'path';
import config from 'config';

import { DataScrappingApp } from './data-scrapping/data-scrapping.app';
import { DatabaseAccessor } from './_models/storage/database-accessor';
import { DatabaseAccessorFactory } from './storage/database-accessor.factory';
import { RunnerType } from './_models/process/process-parameters';
import { SchedulerFactory } from './scheduler/scheduler-factory';
import { ScheduledScrapping } from './_models/schedule/scheduled-scrapping';
import { ServerApp } from './express/server.app';

const appDir = path.dirname(require?.main?.filename || '');
const childScriptPath = path.join(appDir, '../../russian-losses-scrapper/src/index.ts');
const databaseType = config.get<string>('DataBase.Type');

export class Application {
  private _dataBaseAccessor: DatabaseAccessor = DatabaseAccessorFactory.create(databaseType);
  private static _instance: Application | null = null;
  private constructor() {}

  public static getInstance() {
    if (!Application._instance) {
      Application._instance = new Application();
    }
    return Application._instance;
  }

  private async _isDataAlreadyPresent() {
    const modDataPresent = await this._dataBaseAccessor.getIsMoDDataPresent();
    const russiaOryxDataPresent = await this._dataBaseAccessor.getIsOryxCountryDataPresent('russia');
    const ukraineOryxDataPresent = await this._dataBaseAccessor.getIsOryxCountryDataPresent('Ukraine');
    return modDataPresent && russiaOryxDataPresent && ukraineOryxDataPresent;
  }

  private async _runScrapper() {
    const schedulerFactory = new SchedulerFactory();
    const scheduleConfig = config.get<ScheduledScrapping>('Scrapping');
    const dataScrappingApp = new DataScrappingApp(
      this._dataBaseAccessor,
      {
        entryPath: childScriptPath,
        runner: RunnerType.TS,
      },
      schedulerFactory,
      scheduleConfig,
    );
    const isDataPresent = await this._isDataAlreadyPresent();
    if (!isDataPresent) {
      await dataScrappingApp.runInitial();
    }
    dataScrappingApp.runScheduled();
  }

  private _runServer() {
    const server = new ServerApp(this._dataBaseAccessor);
    server.initialize();
  }

  public async run() {
    await this._runScrapper();
    this._runServer();
  }
}
