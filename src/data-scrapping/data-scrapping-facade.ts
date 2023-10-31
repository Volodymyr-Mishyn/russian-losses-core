import { DataSaver } from '../_models/data-saver';
import { OryxTypes, OutputTypes } from '../_models/scrapping/scrapping-parameters';
import { MODScrappingParametersImpl } from './parameters/mod-scrapping-parameters';
import { MODData } from '../_models/entities/mod/mod-model';
import { ProcessParameters, RunnerType } from '../_models/process/process-parameters';
import { ProcessRunner } from '../process/process-runner';
import { ScrapDataAction } from './actions/scrap-data.action';
import { MODDataProcessor } from './processors/mod-data-processor';
import { Action } from '../_models/action';
import { OryxSideLosses } from '../_models/entities/oryx/oryx-model';
import { OryxScrappingParametersImpl } from './parameters/oryx-scrapping-parameters';
import { OryxDataProcessor } from './processors/oryx-data-processor';

export class DataScrappingFacade {
  constructor(
    private _scriptPath: string,
    private _scriptRunner: RunnerType,
  ) {}

  public createScrapAllMODReportsAction(saver: DataSaver<MODData>): Action {
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
    const scrapMODDataAction = new ScrapDataAction(processMOD, new MODDataProcessor(), saver);
    return scrapMODDataAction;
  }

  public createScrapRecentMODReportsAction(saver: DataSaver<MODData>): Action {
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
    const scrapMODDataAction = new ScrapDataAction(processMOD, new MODDataProcessor(), saver);
    return scrapMODDataAction;
  }

  public createScrapRussianLossesOryxAction(saver: DataSaver<OryxSideLosses>): Action {
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
    const scrapOryxRussiaDataAction = new ScrapDataAction(processOryxRussia, new OryxDataProcessor(), saver);
    return scrapOryxRussiaDataAction;
  }

  public createScrapUkrainianLossesOryxAction(saver: DataSaver<OryxSideLosses>): Action {
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
    const scrapOryxUkraineDataAction = new ScrapDataAction(processOryxUkraine, new OryxDataProcessor(), saver);
    return scrapOryxUkraineDataAction;
  }
}
