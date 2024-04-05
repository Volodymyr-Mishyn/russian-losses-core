import { DatabaseAccessor } from '../../_models/storage/database-accessor';
import { Action } from '../../_models/action';
import { DataSaver } from '../../_models/data-saver';
import { MoDData } from '../../_models/entities/mod/mod-model';
import { OryxSideLosses } from '../../_models/entities/oryx/oryx-model';

export abstract class DataScrappingFacade {
  protected modSaver!: DataSaver<MoDData>;
  protected oryxSaver!: DataSaver<OryxSideLosses>;

  constructor(private _databaseAccessor: DatabaseAccessor) {
    this.modSaver = this._databaseAccessor.getMoDSaver();
    this.oryxSaver = this._databaseAccessor.getOryxSaver();
  }

  public abstract createScrapAllMoDReportsAction(): Action;
  public abstract createScrapRecentMoDReportsAction(): Action;
  public abstract createScrapRussianLossesOryxAction(): Action;
  public abstract createScrapUkrainianLossesOryxAction(): Action;
}
