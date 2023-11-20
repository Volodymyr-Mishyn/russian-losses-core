import { flattenMoDData } from 'src/_helpers/mod-utils/mod-flattener';
import { MoDDataFlat } from 'src/_models/entities/mod/mod-model';

describe('flattenMoDData', () => {
  const sampleData = [
    {
      date: new Date('2023-11-10T00:00:00.000Z'),
      dayOfInvasion: 624,
      casualties: [
        { name: 'Tanks', code: 'tanks', total: 5317, increment: 1 },
        { name: 'Armored fighting vehicle', code: 'armored_fighting_vehicle', total: 10017, increment: 3 },
      ],
    },
  ];

  it('should flatten an array of day results', () => {
    const expectedFlatData: MoDDataFlat = [
      {
        date: sampleData[0].date,
        dayOfInvasion: 624,
        data: {
          tanks: { name: 'Tanks', total: 5317, increment: 1 },
          armored_fighting_vehicle: { name: 'Armored fighting vehicle', total: 10017, increment: 3 },
        },
      },
    ];

    const flattenedData = flattenMoDData(sampleData);

    expect(flattenedData).toEqual(expectedFlatData);
  });
});
