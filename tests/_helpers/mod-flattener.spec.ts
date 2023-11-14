import { flattenMODData } from 'src/_helpers/mod-utils/mod-flattener';
import { MODDataFlat } from 'src/_models/entities/mod/mod-model';

describe('flattenMODData', () => {
  const sampleData = [
    {
      date: new Date('2023-11-10T00:00:00.000Z'),
      casualties: [
        { name: 'Tanks', code: 'tanks', total: 5317, increment: 1 },
        { name: 'Armored fighting vehicle', code: 'armored_fighting_vehicle', total: 10017, increment: 3 },
      ],
    },
  ];

  it('should flatten an array of day results', () => {
    const expectedFlatData: MODDataFlat = [
      {
        date: sampleData[0].date,
        data: {
          tanks: { name: 'Tanks', total: 5317, increment: 1 },
          armored_fighting_vehicle: { name: 'Armored fighting vehicle', total: 10017, increment: 3 },
        },
      },
    ];

    const flattenedData = flattenMODData(sampleData);

    expect(flattenedData).toEqual(expectedFlatData);
  });
});
