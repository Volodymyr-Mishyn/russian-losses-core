import { MODScrappingParameters, SourceTypes } from '../../_models/scrapping/scrapping-parameters';
import { ScrappingParametersImpl } from './scrapping-parameters';

export class MODScrappingParametersImpl extends ScrappingParametersImpl implements MODScrappingParameters {
  protected sourceType = SourceTypes.MOD;
  private _full = false;
  get full(): boolean {
    return this._full;
  }
  set full(full: boolean) {
    this._full = full;
  }

  protected innerGetParameters(): Array<string> {
    const parameters = super.innerGetParameters();
    if (this.full) {
      parameters.push('--full');
    }
    return parameters;
  }
}
