export interface MODEntityLoss {
  name: string;
  total: number;
  increment: number;
}

export interface MODDayResult {
  date: string;
  casualties: Array<MODEntityLoss>;
}

export type MODScrapData = Array<MODDayResult>;
