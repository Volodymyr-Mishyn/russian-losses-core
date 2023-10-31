import { OutputTypes, ScrappingParameters, SourceTypes } from '../../_models/scrapping/scrapping-parameters';

export abstract class ScrappingParametersImpl implements ScrappingParameters {
  protected sourceType!: SourceTypes;
  private _notHeadless = false;
  private _outputType = OutputTypes.NONE;
  private _outputPath: string | undefined;

  get source(): SourceTypes {
    return this.sourceType;
  }

  get notHeadless(): boolean {
    return this._notHeadless;
  }
  set notHeadless(notHeadless: boolean) {
    this._notHeadless = notHeadless;
  }

  get outputType(): OutputTypes {
    return this._outputType;
  }
  set outputType(outputType: OutputTypes) {
    this._outputType = outputType;
  }

  get outputPath(): string | undefined {
    return this._outputPath;
  }
  set outputPath(outputPath: string) {
    this._outputPath = outputPath;
  }

  protected innerGetParameters(): Array<string> {
    const parameters: Array<string> = [];
    if (!this.source) {
      throw new Error('no valid source');
    }
    parameters.push(`--source=${this.source}`);
    if (this.notHeadless) {
      parameters.push('--notHeadless');
    }
    if (!this.outputType) {
      throw new Error('no output type');
    }
    parameters.push(`--output=${this.outputType}`);
    if (this.outputPath) {
      parameters.push(`--outputPath=${this.outputPath}`);
    }
    return parameters;
  }

  public getParameters(): Array<string> {
    return this.innerGetParameters();
  }
}
