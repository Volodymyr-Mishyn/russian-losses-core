import {
  MoDDayResult,
  MoDDayResultFlat,
  MoDEntityLossFlat,
  MoDData,
  MoDDataFlat,
} from '../../_models/entities/mod/mod-model';

function flattenDayResult(dayResult: MoDDayResult): MoDDayResultFlat {
  const { date, casualties } = dayResult;
  const flattenedCasualties: { [casualtyCode: string]: MoDEntityLossFlat } = {};

  casualties.forEach((casualty) => {
    flattenedCasualties[casualty.code] = {
      name: casualty.name,
      total: casualty.total,
      increment: casualty.increment,
    };
  });

  return {
    date,
    data: flattenedCasualties,
  };
}

export function flattenMoDData(data: MoDData): MoDDataFlat {
  return data.map(flattenDayResult);
}
