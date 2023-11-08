import { Action } from '../action';
import { Schedule } from './schedule';
import { Scheduler } from './scheduler';

export interface SchedulerFactory {
  create(schedule: Schedule, action: Action): Scheduler;
}
