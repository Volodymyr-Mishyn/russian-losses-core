import { DataSaver } from '../_models/data-saver';
import { OryxTypes, OutputTypes } from '../_models/scrapping/scrapping-parameters';
import { MODScrappingParametersImpl } from './parameters/mod-scrapping-parameters';
import { MODData } from '../_models/entities/mod/mod-model';
import { ProcessBaseParameters, ProcessParameters, RunnerType } from '../_models/process/process-parameters';
import { ProcessRunner } from '../process/process-runner';
import { ScrapDataAction } from './actions/scrap-data.action';
import { MODDataProcessor } from './processors/mod-data-processor';
import { Action } from '../_models/action';
import { OryxSideLosses } from '../_models/entities/oryx/oryx-model';
import { OryxScrappingParametersImpl } from './parameters/oryx-scrapping-parameters';
import { OryxDataProcessor } from './processors/oryx-data-processor';
import { DatabaseAccessor } from 'src/_models/storage/database-accessor';

export class DataScrappingFacade {
  private _scriptPath!: string;
  private _scriptRunner!: RunnerType;
  private _modSaver!: DataSaver<MODData>;
  private _oryxSaver!: DataSaver<OryxSideLosses>;
  constructor(
    private _processParameters: ProcessBaseParameters,
    private _databaseAccessor: DatabaseAccessor,
  ) {
    const { runner, entryPath } = this._processParameters;
    this._scriptPath = entryPath;
    this._scriptRunner = runner;
    this._modSaver = this._databaseAccessor.getMODSaver();
    this._oryxSaver = this._databaseAccessor.getOryxSaver();
  }

  public createScrapAllMODReportsAction(): Action {
    const modUniqueString = `MOD-${Date.now().toString()}`;
    const modParameters = new MODScrappingParametersImpl();
    modParameters.outputType = OutputTypes.PROCESS;
    modParameters.outputPath = modUniqueString;
    modParameters.full = true;
    const processMODParams: ProcessParameters = {
      entryPath: this._scriptPath,
      flags: modParameters.getParameters(),
      runner: this._scriptRunner,
      uniqueKey: modUniqueString,
    };
    const processMOD = new ProcessRunner(processMODParams);
    const scrapMODDataAction = new ScrapDataAction(processMOD, new MODDataProcessor(), this._modSaver);
    return scrapMODDataAction;
  }

  public createScrapRecentMODReportsAction(): Action {
    const modUniqueString = `MOD-${Date.now().toString()}`;
    const modParameters = new MODScrappingParametersImpl();
    modParameters.outputType = OutputTypes.PROCESS;
    modParameters.outputPath = modUniqueString;
    const processMODParams: ProcessParameters = {
      entryPath: this._scriptPath,
      flags: modParameters.getParameters(),
      runner: this._scriptRunner,
      uniqueKey: modUniqueString,
    };
    const processMOD = new ProcessRunner(processMODParams);
    const scrapMODDataAction = new ScrapDataAction(processMOD, new MODDataProcessor(), this._modSaver);
    return scrapMODDataAction;
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
    console.log(oryxRussianParameters.getParameters());
    const processOryxRussia = new ProcessRunner(processOryxRussiaParams);
    const scrapOryxRussiaDataAction = new ScrapDataAction(processOryxRussia, new OryxDataProcessor(), this._oryxSaver);
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
    console.log(oryxUkrainianParameters.getParameters());
    const processOryxUkraine = new ProcessRunner(processOryxUkraineParams);
    const scrapOryxUkraineDataAction = new ScrapDataAction(
      processOryxUkraine,
      new OryxDataProcessor(),
      this._oryxSaver,
    );
    return scrapOryxUkraineDataAction;
  }
}
