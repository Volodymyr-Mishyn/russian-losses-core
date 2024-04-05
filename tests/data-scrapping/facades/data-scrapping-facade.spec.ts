import { DataScrappingProcessFacade } from 'src/data-scrapping/facades/data-scrapping-process-facade';

describe('DataScrappingFacade', () => {
  let dataScrappingFacade: DataScrappingProcessFacade;
  let mockProcessParameters: any;
  let mockDatabaseAccessor: any;

  beforeEach(() => {
    mockProcessParameters = {
      entryPath: 'mock-entry-path',
      runner: 'mock-runner',
    };

    mockDatabaseAccessor = {
      getMoDSaver: jest.fn(),
      getOryxSaver: jest.fn(),
    };

    dataScrappingFacade = new DataScrappingProcessFacade(mockDatabaseAccessor, mockProcessParameters);
  });

  describe('createScrapAllMoDReportsAction', () => {
    it('should create specific action', () => {
      const action = dataScrappingFacade.createScrapAllMoDReportsAction();
      expect(action).toBeTruthy();
    });
  });
  describe('createScrapRecentMoDReportsAction', () => {
    it('should create specific action', () => {
      const action = dataScrappingFacade.createScrapRecentMoDReportsAction();
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
