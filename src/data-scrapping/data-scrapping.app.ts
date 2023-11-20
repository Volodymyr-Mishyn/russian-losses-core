import { SchedulerFactory } from '../_models/schedule/scheduler-factory';
import { delay } from '../_helpers/delay';
import { ProcessBaseParameters } from '../_models/process/process-parameters';
import { DatabaseAccessor } from '../_models/storage/database-accessor';
import { ScheduledScrapping } from '../_models/schedule/scheduled-scrapping';
import { DataScrappingFacade } from './data-scrapping-facade';

export class DataScrappingApp {
  private _dataScrappingFacade!: DataScrappingFacade;
  constructor(
    private _databaseAccessor: DatabaseAccessor,
    private _processParameters: ProcessBaseParameters,
    private _schedulerFactory?: SchedulerFactory,
    private _scheduledScrapping?: ScheduledScrapping,
  ) {
    this._dataScrappingFacade = new DataScrappingFacade(this._processParameters, this._databaseAccessor);
  }

  public async runInitial() {
    const scrapAllMoDAction = this._dataScrappingFacade.createScrapAllMoDReportsAction();
    await scrapAllMoDAction.execute();
    await delay(10000);
    const scrapOryxRussiaAction = this._dataScrappingFacade.createScrapRussianLossesOryxAction();
    await scrapOryxRussiaAction.execute();
    await delay(10000);
    const scrapOryxUkraineAction = this._dataScrappingFacade.createScrapUkrainianLossesOryxAction();
    await scrapOryxUkraineAction.execute();
  }

  public runScheduled(): void {
    if (!this._schedulerFactory || !this._scheduledScrapping) {
      throw new Error('Scheduler not available');
    }
    const scrapRecentMoDAction = this._dataScrappingFacade.createScrapRecentMoDReportsAction();
    const MoDSchedule = this._scheduledScrapping.MoD;
    const MoDScheduler = this._schedulerFactory.create(MoDSchedule, scrapRecentMoDAction);
    MoDScheduler.scheduleExecution();
    const { Russia: russianLossesSchedule, Ukraine: ukrainianLossesSchedule } = this._scheduledScrapping.Oryx;
    const scrapOryxRussiaAction = this._dataScrappingFacade.createScrapRussianLossesOryxAction();
    const russianLossesScheduler = this._schedulerFactory.create(russianLossesSchedule, scrapOryxRussiaAction);
    russianLossesScheduler.scheduleExecution();
    const scrapOryxUkraineAction = this._dataScrappingFacade.createScrapUkrainianLossesOryxAction();
    const ukrainianLossesScheduler = this._schedulerFactory.create(ukrainianLossesSchedule, scrapOryxUkraineAction);
    ukrainianLossesScheduler.scheduleExecution();
  }
}
