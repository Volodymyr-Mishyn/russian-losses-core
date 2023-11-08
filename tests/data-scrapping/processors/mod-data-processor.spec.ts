import { MODScrapData } from 'src/_models/scrapping/scrap-results/mod-scrap-data';
import { ScrapResult } from 'src/_models/scrapping/scrap-results/scrap-result';
import { SourceTypes } from 'src/_models/scrapping/scrapping-parameters';
import { MODDataProcessor } from 'src/data-scrapping/processors/mod-data-processor';

describe('MODDataProcessor', () => {
  describe('process', () => {
    it('should process the data correctly', async () => {
      const mockScrapResult: ScrapResult<MODScrapData> = {
        success: true,
        result: {
          date: '2023-01-01',
          type: SourceTypes.MOD,
          data: [
            {
              date: '2023-01-01',
              casualties: [],
            },
            {
              date: '2023-01-02',
              casualties: [],
            },
          ],
        },
      };

      const modDataProcessor = new MODDataProcessor();
      const processedData = await modDataProcessor.process(mockScrapResult);

      expect(processedData).toEqual([
        {
          date: new Date('2023-01-01'),
          casualties: [],
        },
        {
          date: new Date('2023-01-02'),
          casualties: [],
        },
      ]);
    });
  });
});
