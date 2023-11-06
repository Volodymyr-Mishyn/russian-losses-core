import { DataScrappingFacade } from 'src/data-scrapping/data-scrapping-facade';

describe('DataScrappingFacade', () => {
  let dataScrappingFacade: DataScrappingFacade;
  let mockProcessParameters: any;
  let mockDatabaseAccessor: any;

  beforeEach(() => {
    mockProcessParameters = {
      entryPath: 'mock-entry-path',
      runner: 'mock-runner',
    };

    mockDatabaseAccessor = {
      getMODSaver: jest.fn(),
      getOryxSaver: jest.fn(),
    };

    dataScrappingFacade = new DataScrappingFacade(mockProcessParameters, mockDatabaseAccessor);
  });

  describe('createScrapAllMODReportsAction', () => {
    it('should create specific action', () => {
      const action = dataScrappingFacade.createScrapAllMODReportsAction();
      expect(action).toBeTruthy();
    });
  });
  describe('createScrapRecentMODReportsAction', () => {
    it('should create specific action', () => {
      const action = dataScrappingFacade.createScrapRecentMODReportsAction();
      expect(action).toBeTruthy();
    });
  });
  describe('createScrapRussianLossesOryxAction', () => {
    it('should create specific action', () => {
      const action = dataScrappingFacade.createScrapRussianLossesOryxAction();
      expect(action).toBeTruthy();
    });
  });

  describe('createScrapUkrainianLossesOryxAction', () => {
    it('should create specific action', () => {
      const action = dataScrappingFacade.createScrapUkrainianLossesOryxAction();
      expect(action).toBeTruthy();
    });
  });
});
