import { Action } from 'src/_models/action';
import { ScheduledScrapping } from 'src/_models/schedule/scheduled-scrapping';
import { DataScrappingApp } from 'src/data-scrapping/data-scrapping.app';

jest.mock('src/_helpers/delay', () => ({
  delay: jest.fn(),
}));

const mockedMoDAction = {
  execute: jest.fn(),
};
const mockedMoDRecentAction = {
  execute: jest.fn(),
};
const mockedRussianAction = {
  execute: jest.fn(),
};
const mockedUkrainianAction = {
  execute: jest.fn(),
};
const mockedFacade = {
  createScrapAllMoDReportsAction: () => mockedMoDAction,
  createScrapRecentMoDReportsAction: () => mockedMoDRecentAction,
  createScrapRussianLossesOryxAction: () => mockedRussianAction,
  createScrapUkrainianLossesOryxAction: () => mockedUkrainianAction,
};
jest.mock('src/data-scrapping/facades/data-scrapping-library-facade', () => {
  return {
    DataScrappingLibraryFacade: jest.fn().mockImplementation(() => {
      return mockedFacade;
    }),
  };
});

jest.mock('src/data-scrapping/facades/data-scrapping-process-facade', () => {
  return {
    DataScrappingProcessFacade: jest.fn().mockImplementation(() => {
      return mockedFacade;
    }),
  };
});

describe('DataScrappingApp', () => {
  const mockDatabaseAccessor: any = {};

  const mockProcessParameters: any = {};

  let MoDScheduler: any, russianScheduler: any, ukrainianScheduler: any;
  let mockSchedulerFactory: any;

  beforeEach(() => {
    MoDScheduler = {
      scheduleExecution() {},
    };
    russianScheduler = {
      scheduleExecution() {},
    };
    ukrainianScheduler = {
      scheduleExecution() {},
    };

    mockSchedulerFactory = {
      create: (schedule: any, action: Action) => {
        if (schedule.cronTime === '0') {
          return MoDScheduler;
        }
        if (schedule.cronTime === '1') {
          return russianScheduler;
        }
        if (schedule.cronTime === '2') {
          return ukrainianScheduler;
        }
      },
    };
  });

  const mockScheduledScrapping: ScheduledScrapping = {
    MoD: {
      cronTime: '0',
      attempts: [],
      timezone: '',
    },
    Oryx: {
      Russia: {
        cronTime: '1',
        attempts: [],
        timezone: '',
      },
      Ukraine: {
        cronTime: '2',
        attempts: [],
        timezone: '',
      },
    },
  };

  let dataScrappingApp: DataScrappingApp;

  describe('when data scrapping approach is process', () => {
    beforeEach(() => {
      dataScrappingApp = new DataScrappingApp(
        mockDatabaseAccessor,
        'process',
        mockSchedulerFactory,
        mockScheduledScrapping,
        mockProcessParameters,
      );
    });

    describe('runInitial', () => {
      it('should scrap all MoD data', async () => {
        await dataScrappingApp.runInitial();
        expect(mockedMoDAction.execute).toHaveBeenCalled();
      });

      it('should scrap Oryx russian data', async () => {
        await dataScrappingApp.runInitial();
        expect(mockedRussianAction.execute).toHaveBeenCalled();
      });

      it('should scrap Oryx Ukrainian data', async () => {
        await dataScrappingApp.runInitial();
        expect(mockedUkrainianAction.execute).toHaveBeenCalled();
      });
    });
    describe('runScheduled', () => {
      beforeEach(() => {
        jest.spyOn(mockSchedulerFactory, 'create');
      });
      describe('when schedule config is provided', () => {
        beforeEach(() => {
          dataScrappingApp = new DataScrappingApp(
            mockDatabaseAccessor,
            'process',
            mockSchedulerFactory,
            mockScheduledScrapping,
            mockProcessParameters,
          );
        });

        it('should schedule scrapping recent MoD data', () => {
          jest.spyOn(MoDScheduler, 'scheduleExecution');
          dataScrappingApp.runScheduled();
          expect(mockSchedulerFactory.create).toHaveBeenCalledWith(
            {
              cronTime: '0',
              attempts: [],
              timezone: '',
            },
            expect.any(Object),
          );
          expect(MoDScheduler.scheduleExecution).toHaveBeenCalledTimes(1);
        });

        it('should schedule scrapping Oryx russian data', () => {
          jest.spyOn(russianScheduler, 'scheduleExecution');
          dataScrappingApp.runScheduled();
          expect(mockSchedulerFactory.create).toHaveBeenCalledWith(
            {
              cronTime: '1',
              attempts: [],
              timezone: '',
            },
            mockedRussianAction,
          );
          expect(russianScheduler.scheduleExecution).toHaveBeenCalledTimes(1);
        });

        it('should schedule scrapping Oryx Ukrainian data', () => {
          jest.spyOn(ukrainianScheduler, 'scheduleExecution');
          dataScrappingApp.runScheduled();
          expect(mockSchedulerFactory.create).toHaveBeenCalledWith(
            {
              cronTime: '2',
              attempts: [],
              timezone: '',
            },
            mockedUkrainianAction,
          );
          expect(ukrainianScheduler.scheduleExecution).toHaveBeenCalledTimes(1);
        });
      });
      describe('when schedule config is not provided', () => {
        beforeEach(() => {
          dataScrappingApp = new DataScrappingApp(
            mockDatabaseAccessor,
            'process',
            undefined,
            undefined,
            mockProcessParameters,
          );
        });
        it('should throw error', () => {
          expect(() => {
            dataScrappingApp.runScheduled();
          }).toThrow();
        });
      });
    });
  });

  describe('when data scrapping approach is library', () => {
    beforeEach(() => {
      dataScrappingApp = new DataScrappingApp(
        mockDatabaseAccessor,
        'library',
        mockSchedulerFactory,
        mockScheduledScrapping,
      );
    });

    describe('runInitial', () => {
      it('should scrap all MoD data', async () => {
        await dataScrappingApp.runInitial();
        expect(mockedMoDAction.execute).toHaveBeenCalled();
      });

      it('should scrap Oryx russian data', async () => {
        await dataScrappingApp.runInitial();
        expect(mockedRussianAction.execute).toHaveBeenCalled();
      });

      it('should scrap Oryx Ukrainian data', async () => {
        await dataScrappingApp.runInitial();
        expect(mockedUkrainianAction.execute).toHaveBeenCalled();
      });
    });
    describe('runScheduled', () => {
      beforeEach(() => {
        jest.spyOn(mockSchedulerFactory, 'create');
      });
      describe('when schedule config is provided', () => {
        beforeEach(() => {
          dataScrappingApp = new DataScrappingApp(
            mockDatabaseAccessor,
            'library',
            mockSchedulerFactory,
            mockScheduledScrapping,
          );
        });

        it('should schedule scrapping recent MoD data', () => {
          jest.spyOn(MoDScheduler, 'scheduleExecution');
          dataScrappingApp.runScheduled();
          expect(mockSchedulerFactory.create).toHaveBeenCalledWith(
            {
              cronTime: '0',
              attempts: [],
              timezone: '',
            },
            expect.any(Object),
          );
          expect(MoDScheduler.scheduleExecution).toHaveBeenCalledTimes(1);
        });

        it('should schedule scrapping Oryx russian data', () => {
          jest.spyOn(russianScheduler, 'scheduleExecution');
          dataScrappingApp.runScheduled();
          expect(mockSchedulerFactory.create).toHaveBeenCalledWith(
            {
              cronTime: '1',
              attempts: [],
              timezone: '',
            },
            mockedRussianAction,
          );
          expect(russianScheduler.scheduleExecution).toHaveBeenCalledTimes(1);
        });

        it('should schedule scrapping Oryx Ukrainian data', () => {
          jest.spyOn(ukrainianScheduler, 'scheduleExecution');
          dataScrappingApp.runScheduled();
          expect(mockSchedulerFactory.create).toHaveBeenCalledWith(
            {
              cronTime: '2',
              attempts: [],
              timezone: '',
            },
            mockedUkrainianAction,
          );
          expect(ukrainianScheduler.scheduleExecution).toHaveBeenCalledTimes(1);
        });
      });
      describe('when schedule config is not provided', () => {
        beforeEach(() => {
          dataScrappingApp = new DataScrappingApp(mockDatabaseAccessor, 'library');
        });
        it('should throw error', () => {
          expect(() => {
            dataScrappingApp.runScheduled();
          }).toThrow();
        });
      });
    });
  });
});
