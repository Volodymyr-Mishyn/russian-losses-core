import { OryxScrappingParameters, OryxTypes } from '../../_models/scrapping/scrapping-parameters';
import { ScrappingParametersImpl } from './scrapping-parameters';

export class OryxScrappingParametersImpl extends ScrappingParametersImpl implements OryxScrappingParameters {
  private _subType!: OryxTypes;

  get subType() {
    return this._subType;
  }
  set subType(subType: OryxTypes) {
    this._subType = subType;
  }
  protected innerGetParameters(): Array<string> {
    const parameters = super.innerGetParameters();
    if (!this.subType) {
      throw new Error('no subtype for oryx');
    }
    parameters.push(`--oryxType=${this.subType}`);
    return parameters;
  }
}
