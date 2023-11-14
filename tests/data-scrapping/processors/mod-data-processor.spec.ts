import { MODScrapData } from 'src/_models/scrapping/scrap-results/mod-scrap-data';
import { ScrapResult } from 'src/_models/scrapping/scrap-results/scrap-result';
import { SourceTypes } from 'src/_models/scrapping/scrapping-parameters';
import { MODDataProcessor } from 'src/data-scrapping/processors/mod-data-processor';

describe('MODDataProcessor', () => {
  describe('process', () => {
    it('should rename old names add codes and merge their data', async () => {
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
      console.log('----');
      console.log(processedData[0].casualties);
      expect(processedData[0].casualties).toEqual([
        { name: 'Tanks', total: 0, increment: 0, code: 'tank' },
        {
          name: 'Armored fighting vehicle',
          total: 0,
          increment: 0,
          code: 'armored_fighting_vehicle',
        },
        {
          name: 'Artillery systems',
          total: 0,
          increment: 0,
          code: 'artillery_system',
        },
        { name: 'MLRS', total: 0, increment: 0, code: 'mlrs' },
        {
          name: 'Anti-aircraft warfare',
          total: 0,
          increment: 0,
          code: 'anti_aircraft',
        },
        { name: 'Planes', total: 0, increment: 0, code: 'plane' },
        { name: 'Helicopters', total: 0, increment: 0, code: 'helicopter' },
        { name: 'UAV', total: 0, increment: 0, code: 'uav' },
        {
          name: 'Cruise missiles',
          total: 0,
          increment: 0,
          code: 'cruise_missile',
        },
        { name: 'Ships (boats)', total: 0, increment: 0, code: 'ship' },
        { name: 'Submarines', total: 0, increment: 0, code: 'submarine' },
        {
          name: 'Cars and cisterns',
          total: 8,
          increment: 3,
          code: 'cars_cisterns',
        },
        {
          name: 'Special equipment',
          total: 0,
          increment: 0,
          code: 'special_equipment',
        },
        {
          name: 'Military personnel',
          total: 0,
          increment: 0,
          code: 'personnel',
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
      const firstDayData = processedData[0];
      const secondDayData = processedData[1];
      expect(firstDayData.casualties).toEqual(
        expect.arrayContaining([
          {
            name: 'Armored fighting vehicle',
            code: 'armored_fighting_vehicle',
            total: 0,
            increment: 0,
          },
        ]),
      );
      expect(secondDayData.casualties).toEqual(
        expect.arrayContaining([
          { name: 'Tanks', code: 'tank', total: 1, increment: 0 },
          { name: 'Cars and cisterns', code: 'cars_cisterns', total: 5, increment: 0 },
        ]),
      );
    });
  });
});
