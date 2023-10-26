export interface Schedule {
  cronTime: string;
  attempts: Array<string>;
  timezone: string;
}
