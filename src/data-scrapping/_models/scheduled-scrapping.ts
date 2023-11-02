import { Schedule } from '../../_models/schedule/schedule';
import { OryxTypes } from '../../_models/scrapping/scrapping-parameters';

export interface OryxScheduledScrapping {
  oryxType: OryxTypes;
  Schedule: Schedule;
}

export interface ScheduledScrapping {
  Oryx: Array<OryxScheduledScrapping>;
  MOD: Schedule;
}
