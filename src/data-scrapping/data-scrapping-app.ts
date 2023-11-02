import { delay } from '../_helpers/delay';
import { ProcessBaseParameters } from '../_models/process/process-parameters';
import { DatabaseAccessor } from '../_models/storage/database-accessor';
import { ScheduledScrapping } from './_models/scheduled-scrapping';
import { DataScrappingFacade } from './data-scrapping-facade';

export class DataScrappingApp {
  private _dataScrappingFacade!: DataScrappingFacade;
  constructor(
    private _databaseAccessor: DatabaseAccessor,
    private _processParameters: ProcessBaseParameters,
    private _scheduledScrapping?: ScheduledScrapping,
  ) {
    this._dataScrappingFacade = new DataScrappingFacade(this._processParameters, this._databaseAccessor);
  }
  public async runInitial() {
    const scrapAllModAction = this._dataScrappingFacade.createScrapAllMODReportsAction();
    await scrapAllModAction.execute();
    await delay(10000);
    const scrapAllOryxRussiaAction = this._dataScrappingFacade.createScrapRussianLossesOryxAction();
    scrapAllOryxRussiaAction.execute();
    await delay(10000);
    const scrapAllOryxUkraineAction = this._dataScrappingFacade.createScrapUkrainianLossesOryxAction();
    scrapAllOryxUkraineAction.execute();
  }
  public async run(): Promise<void> {}
}
