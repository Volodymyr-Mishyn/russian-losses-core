import { OryxScrapData } from 'src/_models/scrapping/scrap-results/oryx-scrap-data';
import { ScrapResult } from 'src/_models/scrapping/scrap-results/scrap-result';
import { SourceTypes } from 'src/_models/scrapping/scrapping-parameters';
import { OryxDataProcessor } from 'src/data-scrapping/processors/oryx-data-processor';

describe('OryxDataProcessor', () => {
  describe('process', () => {
    it('should process the data correctly', async () => {
      const mockScrapResult: ScrapResult<OryxScrapData> = {
        success: true,
        result: {
          type: SourceTypes.ORYX,
          data: {
            entities: [
              {
                name: 'Tanks',
                details: [
                  {
                    abandoned: { count: 1, list: [] },
                    captured: { count: 1, list: [] },
                    count: 4,
                    damaged: { count: 1, list: [] },
                    damagedAndAbandoned: { count: 1, list: [] },
                    damagedAndCaptured: { count: 1, list: [] },
                    destroyed: { count: 1, list: [] },
                    name: 'some tank',
                  },
                ],
                statistics: {
                  abandoned: 1,
                  captured: 1,
                  count: 4,
                  damaged: 1,
                  destroyed: 1,
                },
              },
            ],
            name: 'Russia',
            statistics: {
              abandoned: 1,
              captured: 1,
              count: 4,
              damaged: 1,
              destroyed: 1,
            },
          },
          date: '2023-01-01',
        },
      };

      const oryxDataProcessor = new OryxDataProcessor();
      const processedData = await oryxDataProcessor.process(mockScrapResult);

      expect(processedData).toEqual({
        countryName: 'RUSSIA',
        date: new Date('2023-01-01'),
        entityTypes: [
          {
            countryName: 'RUSSIA',
            details: [
              {
                abandoned: {
                  count: 1,
                  list: [],
                },
                captured: {
                  count: 1,
                  list: [],
                },
                count: 4,
                damaged: {
                  count: 1,
                  list: [],
                },
                damagedAndAbandoned: {
                  count: 1,
                  list: [],
                },
                damagedAndCaptured: {
                  count: 1,
                  list: [],
                },
                destroyed: {
                  count: 1,
                  list: [],
                },
                name: 'some tank',
              },
            ],
            entities: [
              {
                abandoned: {
                  count: 1,
                  list: [],
                },
                captured: {
                  count: 1,
                  list: [],
                },
                count: 4,
                countryName: 'RUSSIA',
                damaged: {
                  count: 1,
                  list: [],
                },
                damagedAndAbandoned: {
                  count: 1,
                  list: [],
                },
                damagedAndCaptured: {
                  count: 1,
                  list: [],
                },
                destroyed: {
                  count: 1,
                  list: [],
                },
                entityType: 'Tanks',
                name: 'some tank',
              },
            ],
            name: 'Tanks',
            statistics: {
              abandoned: 1,
              captured: 1,
              count: 4,
              damaged: 1,
              destroyed: 1,
            },
          },
        ],
        name: 'Russia',
        statistics: {
          abandoned: 1,
          captured: 1,
          count: 4,
          damaged: 1,
          destroyed: 1,
        },
      });
    });
  });
});
