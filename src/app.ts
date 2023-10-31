import path from 'path';
import { RunnerType } from './_models/process/process-parameters';
import { DataScrappingFacade } from './data-scrapping/data-scrapping-facade';
import { MODSaver } from './storage/mongoose/saver/mod-saver';

const appDir = path.dirname(require?.main?.filename || '');
const childScriptPath = path.join(appDir, '../../russian-losses-scrapper/src/index.ts');
export async function run() {
  const scrappingFacade = new DataScrappingFacade(childScriptPath, RunnerType.TS);
  const modSaver = new MODSaver();
  const shouldScrapAll = true;
  if (shouldScrapAll) {
    const action = scrappingFacade.createScrapRecentMODReportsAction(modSaver);
    await action.execute();
  }
}
