import { Logger } from '../_helpers/logger';
import { Action } from '../_models/action';
import { Schedule } from '../_models/schedule/schedule';
import { CronJob } from 'cron';

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
    try {
      const executionResult = await this._action.execute();
      if (executionResult.status) {
        return;
      }
      if (executionResult.error) {
        console.error('Handled error during execution', executionResult.error);
      }
    } catch (error) {
      console.error('Not handled error of execution:', error);
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
    const job = CronJob.from({
      cronTime,
      onTick: async () => {
        if (isRetry) {
          job.stop();
        }
        await this._handleScheduledExecution();
      },
      context: this,
      timeZone: this._scheduleConfig.timezone,
    });
    const infoString = `Execution scheduled on ${job.nextDate()}`;
    Logger.log(`Scheduler: ${infoString}`, '\x1b[30m');
    job.start();
  }

  public scheduleExecution(): void {
    this._innerScheduleExecution(this._scheduleConfig.cronTime);
  }
}
