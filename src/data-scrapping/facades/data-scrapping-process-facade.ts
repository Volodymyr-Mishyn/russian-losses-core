import { OryxTypes, OutputTypes } from '../../_models/scrapping/scrapping-parameters';
import { MoDScrappingParametersImpl } from '../parameters/mod-scrapping-parameters';
import { ProcessBaseParameters, ProcessParameters, RunnerType } from '../../_models/process/process-parameters';
import { ProcessRunner } from '../../process/process-runner';
import { ScrapDataProcessAction } from '../actions/scrap-data-process.action';
import { MoDDataProcessor } from '../processors/mod-data-processor';
import { Action } from '../../_models/action';
import { OryxScrappingParametersImpl } from '../parameters/oryx-scrapping-parameters';
import { OryxDataProcessor } from '../processors/oryx-data-processor';
import { DatabaseAccessor } from '../../_models/storage/database-accessor';
import { DataScrappingFacade } from './data-scrapping-facade';

export class DataScrappingProcessFacade extends DataScrappingFacade {
  private _scriptPath!: string;
  private _scriptRunner!: RunnerType;

  constructor(
    _databaseAccessor: DatabaseAccessor,
    private _processParameters: ProcessBaseParameters,
  ) {
    super(_databaseAccessor);
    const { runner, entryPath } = this._processParameters;
    this._scriptPath = entryPath;
    this._scriptRunner = runner;
  }

  public createScrapAllMoDReportsAction(): Action {
    const modUniqueString = `MoD-${Date.now().toString()}`;
    const modParameters = new MoDScrappingParametersImpl();
    modParameters.outputType = OutputTypes.PROCESS;
    modParameters.outputPath = modUniqueString;
    modParameters.full = true;
    const processMoDParams: ProcessParameters = {
      entryPath: this._scriptPath,
      flags: modParameters.getParameters(),
      runner: this._scriptRunner,
      uniqueKey: modUniqueString,
    };
    const processMoD = new ProcessRunner(processMoDParams);
    const scrapMoDDataAction = new ScrapDataProcessAction(processMoD, new MoDDataProcessor(true), this.modSaver);
    return scrapMoDDataAction;
  }

  public createScrapRecentMoDReportsAction(): Action {
    const modUniqueString = `MoD-${Date.now().toString()}`;
    const modParameters = new MoDScrappingParametersImpl();
    modParameters.outputType = OutputTypes.PROCESS;
    modParameters.outputPath = modUniqueString;
    const processMoDParams: ProcessParameters = {
      entryPath: this._scriptPath,
      flags: modParameters.getParameters(),
      runner: this._scriptRunner,
      uniqueKey: modUniqueString,
    };
    const processMoD = new ProcessRunner(processMoDParams);
    const scrapMoDDataAction = new ScrapDataProcessAction(processMoD, new MoDDataProcessor(), this.modSaver);
    return scrapMoDDataAction;
  }

  public createScrapRussianLossesOryxAction(): Action {
    const oryxRussianParameters = new OryxScrappingParametersImpl();
    oryxRussianParameters.subType = OryxTypes.RUSSIA;
    oryxRussianParameters.outputType = OutputTypes.PROCESS;
    const oryxRussiaUniqueString = `${OryxTypes.RUSSIA}-${Date.now().toString()}`;
    oryxRussianParameters.outputPath = oryxRussiaUniqueString;
    const processOryxRussiaParams: ProcessParameters = {
      entryPath: this._scriptPath,
      flags: oryxRussianParameters.getParameters(),
      runner: this._scriptRunner,
      uniqueKey: oryxRussiaUniqueString,
    };
    const processOryxRussia = new ProcessRunner(processOryxRussiaParams);
    const scrapOryxRussiaDataAction = new ScrapDataProcessAction(
      processOryxRussia,
      new OryxDataProcessor(),
      this.oryxSaver,
    );
    return scrapOryxRussiaDataAction;
  }

  public createScrapUkrainianLossesOryxAction(): Action {
    const oryxUkrainianParameters = new OryxScrappingParametersImpl();
    oryxUkrainianParameters.subType = OryxTypes.UKRAINE;
    oryxUkrainianParameters.outputType = OutputTypes.PROCESS;
    const oryxUkraineUniqueString = `${OryxTypes.UKRAINE}-${Date.now().toString()}`;
    oryxUkrainianParameters.outputPath = oryxUkraineUniqueString;
    const processOryxUkraineParams: ProcessParameters = {
      entryPath: this._scriptPath,
      flags: oryxUkrainianParameters.getParameters(),
      runner: this._scriptRunner,
      uniqueKey: oryxUkraineUniqueString,
    };
    const processOryxUkraine = new ProcessRunner(processOryxUkraineParams);
    const scrapOryxUkraineDataAction = new ScrapDataProcessAction(
      processOryxUkraine,
      new OryxDataProcessor(),
      this.oryxSaver,
    );
    return scrapOryxUkraineDataAction;
  }
}
