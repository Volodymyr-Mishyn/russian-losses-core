export interface EntityLoss {
  name: string;
  total: number;
  increment: number;
}

export interface DayResult {
  date: Date;
  casualties: Array<EntityLoss>;
}

export type MODData = Array<DayResult>;
