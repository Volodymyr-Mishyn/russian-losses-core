import { MoDScrappingParameters, SourceTypes } from '../../_models/scrapping/scrapping-parameters';
import { ScrappingParametersImpl } from './scrapping-parameters';

export class MoDScrappingParametersImpl extends ScrappingParametersImpl implements MoDScrappingParameters {
  protected sourceType = SourceTypes.MoD;
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

  protected innerGetParametersObject() {
    return {
      source: {
        type: this.source,
        full: this.full,
      },
      output: {
        type: this.outputType,
        outputPath: this.outputPath,
      },
      headless: !this.notHeadless,
    };
  }
}
