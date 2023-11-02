export enum RunnerType {
  NODE = 'node',
  TS = 'ts-node',
}
export interface ProcessBaseParameters {
  runner: RunnerType;
  entryPath: string;
}

export interface ProcessParameters extends ProcessBaseParameters {
  flags: Array<string>;
  uniqueKey: string;
}
