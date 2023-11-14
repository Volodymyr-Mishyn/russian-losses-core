export interface EntityLoss {
  name: string;
  code: string;
  total: number;
  increment: number;
}

export interface DayResult {
  date: Date;
  casualties: Array<EntityLoss>;
}

export type MODData = Array<DayResult>;

export interface EntityLossFlat {
  name: string;
  total: number;
  increment: number;
}

export interface DayResultFlat {
  date: Date;
  data: {
    [casualtyCode: string]: EntityLossFlat;
  };
}

export type MODDataFlat = Array<DayResultFlat>;
