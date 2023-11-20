export interface MoDEntityLoss {
  name: string;
  code: string;
  total: number;
  increment: number;
  correction?: boolean;
}

export interface MoDDayResult {
  date: Date;
  dayOfInvasion: number;
  casualties: Array<MoDEntityLoss>;
}

export type MoDData = Array<MoDDayResult>;

export interface MoDEntityLossFlat {
  name: string;
  total: number;
  increment: number;
}

export interface MoDDayResultFlat {
  date: Date;
  dayOfInvasion: number;
  data: {
    [casualtyCode: string]: MoDEntityLossFlat;
  };
}

export type MoDDataFlat = Array<MoDDayResultFlat>;
