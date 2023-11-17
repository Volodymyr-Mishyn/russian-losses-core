export interface MoDScrapEntityLoss {
  name: string;
  total: number;
  increment: number;
}

export interface MoDScrapDayResult {
  date: string;
  casualties: Array<MoDScrapEntityLoss>;
}

export type MoDScrapData = Array<MoDScrapDayResult>;
