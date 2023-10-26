import { CronJob } from 'cron';
import { Action } from '../_models/action';
import { Schedule } from '../_models/schedule/schedule';

export class Scheduler {
  private _attemptIndex = 0;
  constructor(
    private _scheduleConfig: Schedule,
    private _action: Action,
  ) {}

  private _canMakeAttempt(): boolean {
    if (this._scheduleConfig.attempts.length === 0) {
      return false;
    }
    return this._attemptIndex <= this._scheduleConfig.attempts.length - 1;
  }

  private _getCurrentAttemptCronTime(): string {
    return this._scheduleConfig.attempts[this._attemptIndex];
  }

  private async _handleScheduledExecution(): Promise<void> {
    const executionResult = await this._action.execute();
    console.log('execute result', executionResult);
    if (executionResult) {
      return;
    }
    if (!this._canMakeAttempt()) {
      return;
    }
    const retryAttemptCronTime = this._getCurrentAttemptCronTime();
    if (retryAttemptCronTime) {
      this._attemptIndex++;
      this._innerScheduleExecution(retryAttemptCronTime, true);
    } else {
      this._attemptIndex = 0;
    }
  }

  private _innerScheduleExecution(cronTime: string, isRetry = false): void {
    console.log('schedule', cronTime, isRetry);
    const job = CronJob.from({
      cronTime,
      onTick: async () => {
        if (isRetry) {
          job.stop();
        }
        await this._handleScheduledExecution();
      },
      start: true,
      context: this,
      timeZone: this._scheduleConfig.timezone,
    });
  }
  public scheduleExecution(): void {
    this._innerScheduleExecution(this._scheduleConfig.cronTime);
  }
}
