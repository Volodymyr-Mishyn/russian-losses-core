import { MODScrapData } from 'src/_models/scrapping/scrap-results/mod-scrap-data';
import { ScrapResult } from 'src/_models/scrapping/scrap-results/scrap-result';
import { SourceTypes } from 'src/_models/scrapping/scrapping-parameters';
import { MODDataProcessor } from 'src/data-scrapping/processors/mod-data-processor';

describe('MODDataProcessor', () => {
  describe('process', () => {
    it('should rename old names and merge their data', async () => {
      const mockScrapResult: ScrapResult<MODScrapData> = {
        success: true,
        result: {
          date: '2023-01-01',
          type: SourceTypes.MOD,
          data: [
            {
              date: '2023-01-01',
              casualties: [
                {
                  name: 'Tanks',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Armored fighting vehicle',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Artillery systems',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Mobile SRBM',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Anti-aircraft warfare',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Planes',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Helicopters',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'UAV',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Cruise missiles',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Ships (boats)',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Submarines',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Cars',
                  total: 5,
                  increment: 2,
                },
                {
                  name: 'Cisterns with fuel',
                  total: 3,
                  increment: 1,
                },
                {
                  name: 'Special equipment',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Military personnel',
                  total: 0,
                  increment: 0,
                },
              ],
            },
          ],
        },
      };
      const modDataProcessor = new MODDataProcessor();
      const processedData = await modDataProcessor.process(mockScrapResult);
      expect(processedData[0].date).toEqual(new Date('2023-01-01'));
      expect(processedData[0].casualties).toEqual([
        {
          increment: 0,
          name: 'Tanks',
          total: 0,
        },
        {
          increment: 0,
          name: 'Armored fighting vehicle',
          total: 0,
        },
        {
          increment: 0,
          name: 'Artillery systems',
          total: 0,
        },
        {
          increment: 0,
          name: 'MLRS',
          total: 0,
        },
        {
          increment: 0,
          name: 'Anti-aircraft warfare',
          total: 0,
        },
        {
          increment: 0,
          name: 'Planes',
          total: 0,
        },
        {
          increment: 0,
          name: 'Helicopters',
          total: 0,
        },
        {
          increment: 0,
          name: 'UAV',
          total: 0,
        },
        {
          increment: 0,
          name: 'Cruise missiles',
          total: 0,
        },
        {
          increment: 0,
          name: 'Ships (boats)',
          total: 0,
        },
        {
          increment: 0,
          name: 'Submarines',
          total: 0,
        },
        {
          increment: 3,
          name: 'Cars and cisterns',
          total: 8,
        },
        {
          increment: 0,
          name: 'Special equipment',
          total: 0,
        },
        {
          increment: 0,
          name: 'Military personnel',
          total: 0,
        },
      ]);
    });
    it('should fill data from previous day if present', async () => {
      const mockScrapResult: ScrapResult<MODScrapData> = {
        success: true,
        result: {
          date: '2023-01-01',
          type: SourceTypes.MOD,
          data: [
            {
              date: '2023-01-01',
              casualties: [
                {
                  name: 'Tanks',
                  total: 1,
                  increment: 1,
                },
                {
                  name: 'Armored fighting vehicle',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Mobile SRBM',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Anti-aircraft warfare',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Planes',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Helicopters',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'UAV',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Cruise missiles',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Ships (boats)',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Submarines',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Cars and cisterns',
                  total: 5,
                  increment: 2,
                },
                {
                  name: 'Special equipment',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Military personnel',
                  total: 0,
                  increment: 0,
                },
              ],
            },
            {
              date: '2023-01-02',
              casualties: [
                {
                  name: 'Armored fighting vehicle',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Artillery systems',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Mobile SRBM',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Anti-aircraft warfare',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Planes',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Helicopters',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'UAV',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Cruise missiles',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Ships (boats)',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Submarines',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Special equipment',
                  total: 0,
                  increment: 0,
                },
                {
                  name: 'Military personnel',
                  total: 0,
                  increment: 0,
                },
              ],
            },
          ],
        },
      };
      const modDataProcessor = new MODDataProcessor();
      const processedData = await modDataProcessor.process(mockScrapResult);
      const secondDayData = processedData[1];
      expect(secondDayData.casualties).toEqual(
        expect.arrayContaining([
          { name: 'Tanks', total: 1, increment: 0 },
          { name: 'Cars and cisterns', total: 5, increment: 0 },
        ]),
      );
    });
  });
});
