import { Schedule } from './schedule';

export interface ScheduledScrapping {
  Oryx: {
    Russia: Schedule;
    Ukraine: Schedule;
  };
  MoD: Schedule;
}
