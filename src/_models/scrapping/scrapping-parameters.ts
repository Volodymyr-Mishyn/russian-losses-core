export enum SourceTypes {
  MOD = 'mod',
  ORYX = 'oryx',
}
export enum OutputTypes {
  FILE = 'file',
  HTTP = 'http',
  PROCESS = 'process',
  NONE = 'none',
}

export enum OryxTypes {
  RUSSIA = 'Russia',
  UKRAINE = 'Ukraine',
}

export interface ScrappingParameters {
  source: SourceTypes;
  notHeadless?: boolean;
  outputType: OutputTypes;
  outputPath?: string;
  getParameters: () => Array<string>;
}

export interface OryxScrappingParameters extends ScrappingParameters {
  subType: OryxTypes;
}

export interface MODScrappingParameters extends ScrappingParameters {
  full: boolean;
}
