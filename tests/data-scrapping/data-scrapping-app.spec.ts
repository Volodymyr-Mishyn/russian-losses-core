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
jest.mock('src/data-scrapping/data-scrapping-facade', () => {
  return {
    DataScrappingFacade: jest.fn().mockImplementation(() => {
      return {
        createScrapAllMoDReportsAction: () => mockedMoDAction,
        createScrapRecentMoDReportsAction: () => mockedMoDRecentAction,
        createScrapRussianLossesOryxAction: () => mockedRussianAction,
        createScrapUkrainianLossesOryxAction: () => mockedUkrainianAction,
      };
    }),
  };
});

describe('DataScrappingApp', () => {
  const mockDatabaseAccessor: any = {};

  const mockProcessParameters: any = {};

  const MoDScheduler = {
    scheduleExecution() {},
  };
  const russianScheduler = {
    scheduleExecution() {},
  };
  const ukrainianScheduler = {
    scheduleExecution() {},
  };

  const mockSchedulerFactory: any = {
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

  beforeEach(() => {
    dataScrappingApp = new DataScrappingApp(
      mockDatabaseAccessor,
      mockProcessParameters,
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
          mockProcessParameters,
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
          mockedMoDRecentAction,
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
        dataScrappingApp = new DataScrappingApp(mockDatabaseAccessor, mockProcessParameters);
      });
      it('should throe error', () => {
        expect(() => {
          dataScrappingApp.runScheduled();
        }).toThrow();
      });
    });
  });
});
