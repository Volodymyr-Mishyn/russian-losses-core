import { OryxTypes, OutputTypes } from '../../_models/scrapping/scrapping-parameters';
import { Action } from '../../_models/action';
import { ScrapDataAction } from '../actions/scrap-data.action';
import { MoDScrappingParametersImpl } from '../parameters/mod-scrapping-parameters';
import { DataScrappingFacade } from './data-scrapping-facade';
import { MoDDataProcessor } from '../processors/mod-data-processor';
import { OryxScrappingParametersImpl } from '../parameters/oryx-scrapping-parameters';
import { OryxDataProcessor } from '../processors/oryx-data-processor';

export class DataScrappingLibraryFacade extends DataScrappingFacade {
  public createScrapAllMoDReportsAction(): Action {
    const modParameters = new MoDScrappingParametersImpl();
    modParameters.full = true;
    modParameters.outputType = OutputTypes.NONE;
    return new ScrapDataAction(new MoDDataProcessor(true), this.modSaver, modParameters.getParametersObject());
  }

  public createScrapRecentMoDReportsAction(): Action {
    const modParameters = new MoDScrappingParametersImpl();
    modParameters.full = false;
    modParameters.outputType = OutputTypes.NONE;
    return new ScrapDataAction(new MoDDataProcessor(), this.modSaver, modParameters.getParametersObject());
  }

  public createScrapRussianLossesOryxAction(): Action {
    const oryxParameters = new OryxScrappingParametersImpl();
    oryxParameters.subType = OryxTypes.RUSSIA;
    oryxParameters.outputType = OutputTypes.NONE;
    return new ScrapDataAction(new OryxDataProcessor(), this.oryxSaver, oryxParameters.getParametersObject());
  }

  public createScrapUkrainianLossesOryxAction(): Action {
    const oryxParameters = new OryxScrappingParametersImpl();
    oryxParameters.subType = OryxTypes.UKRAINE;
    oryxParameters.outputType = OutputTypes.NONE;
    return new ScrapDataAction(new OryxDataProcessor(), this.oryxSaver, oryxParameters.getParametersObject());
  }
}
