import path from 'path';
import config from 'config';

import { DataScrappingApp } from './data-scrapping/data-scrapping-app';
import { DatabaseAccessor } from './_models/storage/database-accessor';
import { DatabaseAccessorFactory } from './storage/database-accessor.factory';
import { RunnerType } from './_models/process/process-parameters';
import { SchedulerFactory } from './scheduler/scheduler-factory';
import { ScheduledScrapping } from './_models/schedule/scheduled-scrapping';

const appDir = path.dirname(require?.main?.filename || '');
const childScriptPath = path.join(appDir, '../../russian-losses-scrapper/src/index.ts');

const databaseType = config.get<string>('DataBase.Type');

const databaseAccessor: DatabaseAccessor = DatabaseAccessorFactory.create(databaseType);
async function runScrapper() {
  const schedulerFactory = new SchedulerFactory();
  const scheduleConfig = config.get<ScheduledScrapping>('Scrapping');
  const dataScrappingApp = new DataScrappingApp(
    databaseAccessor,
    {
      entryPath: childScriptPath,
      runner: RunnerType.TS,
    },
    schedulerFactory,
    scheduleConfig,
  );
  const modDataPresent = await databaseAccessor.getIsMODDataPresent();
  const russiaOryxDataPresent = await databaseAccessor.getIsOryxCountryDataPresent('russia');
  const ukraineOryxDataPresent = await databaseAccessor.getIsOryxCountryDataPresent('Ukraine');
  if (!modDataPresent || !russiaOryxDataPresent || !ukraineOryxDataPresent) {
    await dataScrappingApp.runInitial();
  }
  dataScrappingApp.runScheduled();
}

export async function run() {
  await runScrapper();
}
