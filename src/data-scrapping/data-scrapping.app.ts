import { SchedulerFactory } from '../_models/schedule/scheduler-factory';
import { delay } from '../_helpers/delay';
import { ProcessBaseParameters } from '../_models/process/process-parameters';
import { DatabaseAccessor } from '../_models/storage/database-accessor';
import { ScheduledScrapping } from '../_models/schedule/scheduled-scrapping';
import { DataScrappingFacade } from './data-scrapping-facade';
import { Logger } from '../_helpers/logger';
import { Action } from '../_models/action';

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

  private _runScheduledMoD(): void {
    if (!this._schedulerFactory || !this._scheduledScrapping) {
      throw new Error('Scheduler not available');
    }
    const scrapRecentMoDAction = this._dataScrappingFacade.createScrapRecentMoDReportsAction();
    const scrapAllMoDAction = this._dataScrappingFacade.createScrapAllMoDReportsAction();
    const action: Action = {
      execute: async () => {
        const isAllMoDDataPresent = await this._databaseAccessor.getIsAllMoDDataPresent();
        if (!isAllMoDDataPresent) {
          Logger.log(`DS_APP:SOMETHING WENT WRONG, NO MoD Data`, '\x1b[33m');
          return scrapAllMoDAction.execute();
        } else {
          return scrapRecentMoDAction.execute();
        }
      },
    };
    const MoDSchedule = this._scheduledScrapping.MoD;
    const MoDScheduler = this._schedulerFactory.create(MoDSchedule, action);
    MoDScheduler.scheduleExecution();
  }

  private _runScheduledOryx(): void {
    if (!this._schedulerFactory || !this._scheduledScrapping) {
      throw new Error('Scheduler not available');
    }
    const { Russia: russianLossesSchedule, Ukraine: ukrainianLossesSchedule } = this._scheduledScrapping.Oryx;
    const scrapOryxRussiaAction = this._dataScrappingFacade.createScrapRussianLossesOryxAction();
    const russianLossesScheduler = this._schedulerFactory.create(russianLossesSchedule, scrapOryxRussiaAction);
    russianLossesScheduler.scheduleExecution();
    const scrapOryxUkraineAction = this._dataScrappingFacade.createScrapUkrainianLossesOryxAction();
    const ukrainianLossesScheduler = this._schedulerFactory.create(ukrainianLossesSchedule, scrapOryxUkraineAction);
    ukrainianLossesScheduler.scheduleExecution();
  }

  public async runInitialMoD(): Promise<void> {
    Logger.log(`DS_APP:Execution of MOD started`, '\x1b[33m');
    const scrapAllMoDAction = this._dataScrappingFacade.createScrapAllMoDReportsAction();
    await scrapAllMoDAction.execute();
    Logger.log(`DS_APP:Execution of MOD finished`, '\x1b[33m');
    await delay(10000);
  }

  public async runInitialOryx(): Promise<void> {
    Logger.log(`DS_APP:Execution of Oryx russia started`, '\x1b[33m');
    const scrapOryxRussiaAction = this._dataScrappingFacade.createScrapRussianLossesOryxAction();
    await scrapOryxRussiaAction.execute();
    Logger.log(`DS_APP:Execution of Oryx russia finished`, '\x1b[33m');
    Logger.log(`DS_APP: DELAY 300000ms`, '\x1b[33m');
    await delay(300000);
    Logger.log(`DS_APP:Execution of Oryx Ukraine started`, '\x1b[33m');
    const scrapOryxUkraineAction = this._dataScrappingFacade.createScrapUkrainianLossesOryxAction();
    await scrapOryxUkraineAction.execute();
    Logger.log(`DS_APP:Execution of Oryx Ukraine finished`, '\x1b[33m');
  }

  public async runInitial(): Promise<void> {
    await this.runInitialMoD();
    await this.runInitialOryx();
  }

  public runScheduled(): void {
    this._runScheduledMoD();
    this._runScheduledOryx();
  }
}
