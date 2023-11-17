import { MoDScrapData } from 'src/_models/scrapping/scrap-results/mod-scrap-data';
import { ScrapResult } from 'src/_models/scrapping/scrap-results/scrap-result';
import { SourceTypes } from 'src/_models/scrapping/scrapping-parameters';
import { MoDDataProcessor } from 'src/data-scrapping/processors/mod-data-processor';

describe('MoDDataProcessor', () => {
  describe('process', () => {
    it('should rename old names add codes and merge their data', async () => {
      const mockScrapResult: ScrapResult<MoDScrapData> = {
        success: true,
        result: {
          date: '2023-01-01',
          type: SourceTypes.MoD,
          data: [
            {
              date: '2023-01-01',
              casualties: [
                { name: 'Tanks', total: 0, increment: 0 },
                { name: 'Armored fighting vehicle', total: 0, increment: 0 },
                { name: 'Artillery systems', total: 0, increment: 0 },
                { name: 'Mobile SRBM', total: 0, increment: 0 },
                { name: 'Anti-aircraft warfare', total: 0, increment: 0 },
                { name: 'Planes', total: 0, increment: 0 },
                { name: 'Helicopters', total: 0, increment: 0 },
                { name: 'UAV', total: 0, increment: 0 },
                { name: 'Cruise missiles', total: 0, increment: 0 },
                { name: 'Ships (boats)', total: 0, increment: 0 },
                { name: 'Submarines', total: 0, increment: 0 },
                { name: 'Cars', total: 5, increment: 2 },
                { name: 'Cisterns with fuel', total: 3, increment: 1 },
                { name: 'Special equipment', total: 0, increment: 0 },
                { name: 'Military personnel', total: 0, increment: 0 },
              ],
            },
          ],
        },
      };
      const modDataProcessor = new MoDDataProcessor();
      const processedData = await modDataProcessor.process(mockScrapResult);
      expect(processedData[0].date).toEqual(new Date('2023-01-01'));
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
      const mockScrapResult: ScrapResult<MoDScrapData> = {
        success: true,
        result: {
          date: '2023-01-01',
          type: SourceTypes.MoD,
          data: [
            {
              date: '2023-09-13T00:00:00.000Z',
              casualties: [
                { name: 'Tanks', total: 4584, increment: 16 },
                { name: 'Armored fighting vehicle', total: 8792, increment: 14 },
                { name: 'Artillery systems', total: 5902, increment: 30 },
                { name: 'MLRS', total: 766, increment: 2 },
                { name: 'Anti-aircraft warfare', total: 517, increment: 2 },
                { name: 'Planes', total: 315, increment: 0 },
                { name: 'Helicopters', total: 316, increment: 0 },
                { name: 'UAV', total: 4650, increment: 5 },
                { name: 'Cruise missiles', total: 1455, increment: 0 },
                { name: 'Ships (boats)', total: 19, increment: 0 },
                { name: 'Cars and cisterns', total: 8444, increment: 31 },
                { name: 'Special equipment', total: 884, increment: 3 },
                { name: 'Military personnel', total: 270350, increment: 590 },
              ],
            },
            {
              date: '2023-09-14T00:00:00.000Z',
              casualties: [
                { name: 'Tanks', total: 4599, increment: 15 },
                { name: 'Armored fighting vehicle', total: 8810, increment: 18 },
                { name: 'Artillery systems', total: 5944, increment: 42 },
                { name: 'MLRS', total: 769, increment: 3 },
                { name: 'Anti-aircraft warfare', total: 517, increment: 0 },
                { name: 'Planes', total: 315, increment: 0 },
                { name: 'UAV', total: 4697, increment: 47 },
                { name: 'Cruise missiles', total: 1455, increment: 0 },
                { name: 'Ships (boats)', total: 20, increment: 1 },
                { name: 'Submarines', total: 1, increment: 0 },
                { name: 'Cars and cisterns', total: 8458, increment: 14 },
                { name: 'Special equipment', total: 889, increment: 5 },
                { name: 'Military personnel', total: 270970, increment: 620 },
              ],
            },
            {
              date: '2023-09-15T00:00:00.000Z',
              casualties: [
                { name: 'Tanks', total: 4612, increment: 13 },
                { name: 'Armored fighting vehicle', total: 8814, increment: 4 },
                { name: 'Artillery systems', total: 5972, increment: 28 },
                { name: 'MLRS', total: 774, increment: 5 },
                { name: 'Anti-aircraft warfare', total: 521, increment: 4 },
                { name: 'Planes', total: 315, increment: 0 },
                { name: 'Helicopters', total: 316, increment: 0 },
                { name: 'UAV', total: 4714, increment: 17 },
                { name: 'Cruise missiles', total: 1455, increment: 0 },
                { name: 'Ships (boats)', total: 20, increment: 0 },
                { name: 'Submarines', total: 1, increment: 0 },
                { name: 'Cars and cisterns', total: 8492, increment: 34 },
                { name: 'Special equipment', total: 889, increment: 0 },
                { name: 'Military personnel', total: 271440, increment: 470 },
              ],
            },
          ],
        },
      };
      const modDataProcessor = new MoDDataProcessor();
      const processedData = await modDataProcessor.process(mockScrapResult);
      const firstDayData = processedData[0];
      const secondDayData = processedData[1];
      expect(firstDayData.casualties).toEqual(
        expect.arrayContaining([
          {
            name: 'Armored fighting vehicle',
            code: 'armored_fighting_vehicle',
            total: 8792,
            increment: 14,
          },
          { name: 'Submarines', code: 'submarine', total: 0, increment: 0 },
          { name: 'Tanks', code: 'tank', total: 4584, increment: 16 },
        ]),
      );
      console.log(secondDayData.casualties);
      expect(secondDayData.casualties).toEqual(
        expect.arrayContaining([
          { name: 'Submarines', code: 'submarine', total: 1, increment: 1 },
          { name: 'Helicopters', code: 'helicopter', total: 316, increment: 0 },
          { name: 'Military personnel', code: 'personnel', total: 270970, increment: 620 },
        ]),
      );
    });
  });
});
