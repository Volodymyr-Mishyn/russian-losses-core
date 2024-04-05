import path from 'path';
import config from 'config';
const minimist = require('minimist');
import { DataScrappingApp } from './data-scrapping/data-scrapping.app';
import { DatabaseAccessor } from './_models/storage/database-accessor';
import { DatabaseAccessorFactory } from './storage/database-accessor.factory';
import { RunnerType } from './_models/process/process-parameters';
import { SchedulerFactory } from './scheduler/scheduler-factory';
import { ScheduledScrapping } from './_models/schedule/scheduled-scrapping';
import { ServerApp } from './express/server.app';
import { Logger } from './_helpers/logger';

const appDir = path.dirname(require?.main?.filename || '');
const scraperAppName = config.get<string>('scraperAppName');
const childScriptPath = path.join(appDir, `../../${scraperAppName}/src/index.ts`);
const databaseType = config.get<string>('DataBase.Type');
const cliArgs = minimist(process.argv.slice(2));

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

  private async _runScraper() {
    const schedulerFactory = new SchedulerFactory();
    const scheduleConfig = config.get<ScheduledScrapping>('Scrapping');
    // for process approach
    // {
    //   entryPath: childScriptPath,
    //   runner: RunnerType.TS,
    // }
    const dataScrappingApp = new DataScrappingApp(this._dataBaseAccessor, 'library', schedulerFactory, scheduleConfig);

    if (cliArgs.force) {
      Logger.log(`Force scrapping`, '\x1b[36m');
      await dataScrappingApp.runInitial();
    } else {
      const modDataPresent = await this._dataBaseAccessor.getIsAllMoDDataPresent();
      const russiaOryxDataPresent = await this._dataBaseAccessor.getIsOryxCountryDataPresent('russia');
      const ukraineOryxDataPresent = await this._dataBaseAccessor.getIsOryxCountryDataPresent('Ukraine');
      if (!modDataPresent) {
        Logger.log(`MoD data not present`, '\x1b[36m');
        await dataScrappingApp.runInitialMoD();
      }
      if (!russiaOryxDataPresent || !ukraineOryxDataPresent) {
        Logger.log(`Oryx data not present`, '\x1b[36m');
        await dataScrappingApp.runInitialOryx();
      }
    }
    Logger.log(`Scheduling scrapping`, '\x1b[36m');
    dataScrappingApp.runScheduled();
  }

  private _runServer() {
    const server = new ServerApp(this._dataBaseAccessor);
    server.initialize();
  }

  public async run() {
    Logger.log(`Application booted successfully`, '\x1b[36m');
    if (cliArgs.server) {
      this._runServer();
    }
    if (cliArgs.scraper) {
      await this._runScraper();
    }
  }
}
