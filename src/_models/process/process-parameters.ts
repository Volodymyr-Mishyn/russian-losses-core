export enum RunnerType {
  NODE = 'node',
  TS = 'ts-node',
}
export interface ProcessParameters {
  runner: RunnerType;
  entryPath: string;
  flags: Array<string>;
  uniqueKey: string;
}
