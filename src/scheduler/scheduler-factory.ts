import { Action } from '../_models/action';
import { Schedule } from '../_models/schedule/schedule';
import { Scheduler as SchedulerInterface } from '../_models/schedule/scheduler';
import { SchedulerFactory as SchedulerFactoryInterface } from '../_models/schedule/scheduler-factory';
import { Scheduler } from './scheduler';

export class SchedulerFactory implements SchedulerFactoryInterface {
  create(schedule: Schedule, action: Action): SchedulerInterface {
    return new Scheduler(schedule, action);
  }
}
