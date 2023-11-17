export enum SourceTypes {
  MoD = 'mod',
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
  notHeadless?: boolean;
  outputType: OutputTypes;
  outputPath?: string;
  getParameters: () => Array<string>;
}

export interface OryxScrappingParameters extends ScrappingParameters {
  subType: OryxTypes;
}

export interface MoDScrappingParameters extends ScrappingParameters {
  full: boolean;
}
