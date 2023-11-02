import path from 'path';
import config from 'config';

import { DataScrappingApp } from './data-scrapping/data-scrapping-app';
import { DatabaseAccessor } from './_models/storage/database-accessor';
import { DatabaseAccessorFactory } from './storage/database-accessor.factory';
import { RunnerType } from './_models/process/process-parameters';

const appDir = path.dirname(require?.main?.filename || '');
const childScriptPath = path.join(appDir, '../../russian-losses-scrapper/src/index.ts');

const databaseType = config.get<string>('DataBase.Type');

const databaseAccessor: DatabaseAccessor = DatabaseAccessorFactory.create(databaseType);
export async function run() {
  const dataScrappingApp = new DataScrappingApp(databaseAccessor, {
    entryPath: childScriptPath,
    runner: RunnerType.TS,
  });
  dataScrappingApp.runInitial();
}
