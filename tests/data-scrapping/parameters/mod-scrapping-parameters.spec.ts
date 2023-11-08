import { OutputTypes } from 'src/_models/scrapping/scrapping-parameters';
import { MODScrappingParametersImpl } from 'src/data-scrapping/parameters/mod-scrapping-parameters';

describe('MODScrappingParametersImpl', () => {
  describe('getParameters', () => {
    it('should return the correct parameters with default values', () => {
      const modParameters = new MODScrappingParametersImpl();

      const expectedParameters = ['--source=mod', '--output=none'];

      expect(modParameters.getParameters()).toEqual(expectedParameters);
    });

    it('should return the correct parameters with custom values', () => {
      const modParameters = new MODScrappingParametersImpl();
      modParameters.full = true;
      modParameters.outputType = OutputTypes.PROCESS;
      modParameters.outputPath = '/path/to/output';

      const expectedParameters = ['--source=mod', '--output=process', '--outputPath=/path/to/output', '--full'];

      expect(modParameters.getParameters()).toEqual(expectedParameters);
    });
  });
});
