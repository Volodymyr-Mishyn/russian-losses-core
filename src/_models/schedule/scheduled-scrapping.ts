import { Schedule } from './schedule';
import { OryxTypes } from '../scrapping/scrapping-parameters';

export interface ScheduledScrapping {
  Oryx: {
    Russia: Schedule;
    Ukraine: Schedule;
  };
  MOD: Schedule;
}
