import { DataProcessor } from 'src/_models/data-processor';
import { DataSaver } from 'src/_models/data-saver';
import { ScrapDataAction } from 'src/data-scrapping/actions/scrap-data.action';
import { ProcessRunner } from 'src/process/process-runner';

describe('ScrapDataAction', () => {
  let mockProcessRunner: any;
  let mockDataProcessor: DataProcessor<any, any>;
  let mockDataSaver: DataSaver<unknown>;

  beforeEach(() => {
    mockProcessRunner = {
      run: jest.fn(),
      once: (event: string, callback: any) => {
        if (event === 'data') {
          callback({ data: 'some data' });
          return;
        }
        throw new Error('some wrong event');
      },
    };

    mockDataProcessor = {
      process: jest.fn(),
    };

    mockDataSaver = {
      save: jest.fn(),
    };
  });

  describe('execute', () => {
    it('should execute successfully', async () => {
      jest
        .spyOn(mockDataProcessor as unknown as any, 'process')
        .mockImplementation((data: any) => ({ ...data, processed: true }));
      const scrapDataAction = new ScrapDataAction(
        mockProcessRunner as unknown as ProcessRunner,
        mockDataProcessor as unknown as DataProcessor<unknown, unknown>,
        mockDataSaver as unknown as DataSaver<unknown>,
      );
      const result = await scrapDataAction.execute();
      expect(mockProcessRunner.run).toHaveBeenCalled();
      expect(mockDataProcessor.process).toHaveBeenCalledWith({ data: 'some data' });
      expect(mockDataSaver.save).toHaveBeenCalledWith({ data: 'some data', processed: true });
      expect(result).toEqual({ status: true });
    });

    it('should handle errors', async () => {
      jest.spyOn(mockDataProcessor, 'process').mockImplementation(() => {
        throw new Error('Processing Error');
      });
      const scrapDataAction = new ScrapDataAction(
        mockProcessRunner as unknown as ProcessRunner,
        mockDataProcessor as unknown as DataProcessor<unknown, unknown>,
        mockDataSaver as unknown as DataSaver<unknown>,
      );
      const result = await scrapDataAction.execute();
      expect(result).toEqual({ status: false });
      expect(mockDataSaver.save).not.toHaveBeenCalled();
    });
  });
});
