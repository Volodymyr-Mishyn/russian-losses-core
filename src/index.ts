import { Schedule } from './_models/schedule/schedule';
import { LogAction } from './actions/log-action';
import { Scheduler } from './scheduler/scheduler';

console.log('init!');

const action = new LogAction();
const config: Schedule = {
  cronTime: '*/10 * * * * *',
  attempts: ['*/2 * * * * *', '*/5 * * * * *'],
  timezone: 'Europe/Kiev',
};
const scheduler = new Scheduler(config, action);
scheduler.scheduleExecution();
