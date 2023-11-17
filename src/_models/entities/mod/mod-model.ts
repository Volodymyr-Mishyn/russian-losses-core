export interface MoDEntityLoss {
  name: string;
  code: string;
  total: number;
  increment: number;
}

export interface MoDDayResult {
  date: Date;
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
  data: {
    [casualtyCode: string]: MoDEntityLossFlat;
  };
}

export type MoDDataFlat = Array<MoDDayResultFlat>;
