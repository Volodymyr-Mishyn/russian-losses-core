import { CronJob } from 'cron';
import { Action, ActionExecutionResult } from 'src/_models/action';
import { Schedule } from 'src/_models/schedule/schedule';
import { Scheduler } from 'src/scheduler/scheduler';
const mockCronJob = {
  start: function () {
    this.onTick();
  },
  stop: jest.fn(),
  onTick: jest.fn(),
  nextDate: () => 'next date',
};

jest.mock('cron', () => {
  return {
    CronJob: {
      from: jest.fn((config) => {
        mockCronJob.onTick = config.onTick;
        return mockCronJob;
      }),
    },
  };
});

describe('Scheduler', () => {
  let mockAction: Action;
  let scheduleConfig: Schedule;

  beforeEach(() => {
    mockAction = {
      execute: jest.fn(),
    };
    scheduleConfig = {
      cronTime: '0 9 * * *',
      attempts: ['0 10 * * *', '0 11 * * *'],
      timezone: 'Europe/Kiev',
    };
    jest.clearAllMocks();
  });

  it('should execute action and succeed', async () => {
    jest.spyOn(mockAction, 'execute').mockResolvedValue({ status: true });
    const scheduler = new Scheduler(scheduleConfig, mockAction);
    scheduler.scheduleExecution();
    await new Promise(setImmediate);

    expect(mockAction.execute).toHaveBeenCalledTimes(1);
    expect(CronJob.from).toHaveBeenCalledTimes(1);
  });
  describe('when retries are provided', () => {
    it('should execute action and retry several times', async () => {
      jest.spyOn(mockCronJob, 'stop');
      const executionResults: ActionExecutionResult[] = [
        { status: false, error: 'Retryable error 1' },
        { status: false, error: 'Retryable error 2' },
        { status: true },
      ];

      jest
        .spyOn(mockAction, 'execute')
        .mockResolvedValueOnce(executionResults[0])
        .mockResolvedValueOnce(executionResults[1])
        .mockResolvedValueOnce(executionResults[2]);

      const scheduler = new Scheduler(scheduleConfig, mockAction);
      scheduler.scheduleExecution();
      // Wait for the onTick callback to be executed
      await new Promise(setImmediate);

      expect(mockAction.execute).toHaveBeenCalledTimes(3);
      expect(CronJob.from).toHaveBeenCalledTimes(3);
      expect(mockCronJob.stop).toHaveBeenCalledTimes(2);
    });

    it('should execute action and handle an unhandled error with retries', async () => {
      jest.spyOn(mockCronJob, 'stop');
      jest.spyOn(mockAction, 'execute').mockRejectedValue(new Error('Unhandled error'));

      const scheduler = new Scheduler(scheduleConfig, mockAction);
      scheduler.scheduleExecution();
      await new Promise(setImmediate);

      expect(mockAction.execute).toHaveBeenCalledTimes(3);
      expect(CronJob.from).toHaveBeenCalledTimes(3);
      expect(mockCronJob.stop).toHaveBeenCalledTimes(2);
    });
  });
  describe('when retries are not provided', () => {
    beforeEach(() => {
      scheduleConfig = {
        cronTime: '0 9 * * *',
        attempts: [],
        timezone: 'Europe/Kiev',
      };
    });
    it('should not retry', async () => {
      const executionResults: ActionExecutionResult[] = [
        { status: false, error: 'Retry-able error 1' },
        { status: true },
      ];
      jest
        .spyOn(mockAction, 'execute')
        .mockResolvedValueOnce(executionResults[0])
        .mockResolvedValueOnce(executionResults[1]);

      const scheduler = new Scheduler(scheduleConfig, mockAction);
      scheduler.scheduleExecution();
      // Wait for the onTick callback to be executed
      await new Promise(setImmediate);

      expect(mockAction.execute).toHaveBeenCalledTimes(1);
      expect(CronJob.from).toHaveBeenCalledTimes(1);
    });
  });
});
