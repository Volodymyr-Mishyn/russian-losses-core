import { OryxTypes, OutputTypes } from 'src/_models/scrapping/scrapping-parameters';
import { OryxScrappingParametersImpl } from 'src/data-scrapping/parameters/oryx-scrapping-parameters';

describe('OryxScrappingParametersImpl', () => {
  describe('getParameters', () => {
    it('should return the correct parameters with custom values', () => {
      const oryxParameters = new OryxScrappingParametersImpl();
      oryxParameters.subType = OryxTypes.RUSSIA;
      oryxParameters.outputType = OutputTypes.PROCESS;
      oryxParameters.outputPath = '/path/to/output';

      const expectedParameters = [
        '--source=oryx',
        '--output=process',
        '--outputPath=/path/to/output',
        '--oryxType=Russia',
      ];

      expect(oryxParameters.getParameters()).toEqual(expectedParameters);
    });

    it('should throw an error if subType is not set', () => {
      const oryxParameters = new OryxScrappingParametersImpl();
      oryxParameters.outputType = OutputTypes.PROCESS;
      expect(() => {
        oryxParameters.getParameters();
      }).toThrow('no subtype for oryx');
    });
  });
});
