const db = require('../db');
const LevelData = require('../../../models/LevelDataModel');
const dataService = require('../../../services/dataService');

beforeAll(async () => await db.connect());

afterEach(async () => await db.clearDatabase());

afterAll(async () => await db.closeDatabase());

describe('insert data', () => {
  it('inserts multiple documents from data point array', async () => {
    await dataService.insertLevelData([
      {
        value: 4.5,
        timestamp: new Date(),
        site: '03148000',
      },
      {
        value: 904,
        timestamp: new Date(),
        site: '03148000',
      },
      {
        value: 24.5,
        timestamp: new Date(),
        site: '03148000',
      },
    ]);
    const datum1 = await LevelData.findOne({ value: 4.5 }).exec();
    const datum2 = await LevelData.findOne({ value: 904 }).exec();
    const datum3 = await LevelData.findOne({ value: 24.5 }).exec();
    expect(datum1).not.toEqual(null);
    expect(datum2).not.toEqual(null);
    expect(datum3).not.toEqual(null);
  });
});

describe('deletes old data', () => {
  it('deletes data before date', async () => {
    await LevelData.insertMany([
      {
        value: 4.5,
        timestamp: new Date(Date.now() - 50000),
        site: '03148000',
      },
      {
        value: 904,
        timestamp: new Date(Date.now() - 40000),
        site: '03148000',
      },
      {
        value: 24.5,
        timestamp: new Date(Date.now() - 30000),
        site: '03148000',
      },
    ]);
    await dataService.deleteLevelDataBefore(new Date(Date.now() - 35000));
    const datum1 = await LevelData.findOne({ value: 4.5 }).exec();
    const datum2 = await LevelData.findOne({ value: 904 }).exec();
    const datum3 = await LevelData.findOne({ value: 24.5 }).exec();
    expect(datum1).toEqual(null); //Deleted
    expect(datum2).toEqual(null); //Deleted
    expect(datum3).not.toEqual(null); //Valid
  });
});

describe('find data', () => {
  beforeEach(async () => {
    await LevelData.insertMany([
      {
        value: 4.5,
        timestamp: new Date(Date.now() - 50000),
        site: '03148000',
      },
      {
        value: 12,
        timestamp: new Date(Date.now() - 40450),
        site: '03148001',
      },
      {
        value: 904,
        timestamp: new Date(Date.now() - 40000),
        site: '03148000',
      },
      {
        value: 43,
        timestamp: new Date(Date.now() - 30450),
        site: '03148001',
      },
      {
        value: 24.5,
        timestamp: new Date(Date.now() - 30000),
        site: '03148000',
      },
    ]);
  });

  it('finds data', async () => {
    const data = await dataService.findBySiteAfterDate(
      '03148000',
      new Date(Date.now() - 31000)
    );
    expect(data[0].value).toEqual(24.5);
  });

  it('finds most recent value for site', async () => {
    const data = await dataService.findMostRecentForSite('03148000');
    expect(data.value).toEqual(24.5);
  });

  it('finds the max value for a site', async () => {
    const data = await dataService.findMaxForSite('03148000');
    expect(data.value).toEqual(904);
  });

  it('finds the min value for a site', async () => {
    const data = await dataService.findMinForSite('03148000');
    expect(data.value).toEqual(4.5);
  });
});
