import { DayResult, DayResultFlat, EntityLossFlat, MODData, MODDataFlat } from '../../_models/entities/mod/mod-model';

function flattenDayResult(dayResult: DayResult): DayResultFlat {
  const { date, casualties } = dayResult;
  const flattenedCasualties: { [casualtyCode: string]: EntityLossFlat } = {};

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

export function flattenMODData(data: MODData): MODDataFlat {
  return data.map(flattenDayResult);
}
