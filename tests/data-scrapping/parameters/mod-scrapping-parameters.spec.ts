import { OutputTypes } from 'src/_models/scrapping/scrapping-parameters';
import { MoDScrappingParametersImpl } from 'src/data-scrapping/parameters/mod-scrapping-parameters';

describe('MoDScrappingParametersImpl', () => {
  describe('getParameters', () => {
    it('should return the correct parameters with default values', () => {
      const modParameters = new MoDScrappingParametersImpl();

      const expectedParameters = ['--source=mod', '--output=none'];

      expect(modParameters.getParameters()).toEqual(expectedParameters);
    });

    it('should return the correct parameters with custom values', () => {
      const modParameters = new MoDScrappingParametersImpl();
      modParameters.full = true;
      modParameters.outputType = OutputTypes.PROCESS;
      modParameters.outputPath = '/path/to/output';

      const expectedParameters = ['--source=mod', '--output=process', '--outputPath=/path/to/output', '--full'];

      expect(modParameters.getParameters()).toEqual(expectedParameters);
    });
  });
});
