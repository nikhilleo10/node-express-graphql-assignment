import * as utils from '../findOptionsRequestedRides';
import { mockDBClient, resetAndMockDB } from '@server/utils/testUtils';

describe('handelGetFindOptionsForRequestedRides', () => {
  let dbClient;
  let getFindOptions;

  beforeEach(() => {
    dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);
    getFindOptions = jest.spyOn(utils, 'getFindOptionsRequstedRides');
  });

  afterEach(() => {
    jest.clearAllMocks();
    getFindOptions.mockRestore();
  });

  it('should return findOptions that are used to query sequelize from graphql for completed rides', async () => {
    const db = {
      sequelize: {
        literal: jest.fn(val => val)
      },
      completedRideModel: 'completed_rides',
      incompleteRideModel: 'incomplete_rides'
    };
    const findOptionsKeys = {
      limit: 10,
      order: [['id', 'ASC']],
      where: {},
      offset: 0,
      attributes: [
        'id',
        'pickupLoc',
        'dropLoc',
        'dateOfRide',
        'bookingTime',
        'estFare',
        'estDistance',
        'tripStatus',
        'custId',
        'driverId',
        'createdAt',
        'updatedAt',
        'deletedAt',
        'cust_id',
        'driver_id'
      ],
      logging: undefined,
      graphqlContext: {}
    };
    const args = {
      limit: 10,
      order: 'id DESC',
      where: { tripStatus: 'COMPLETED', custId: 2 },
      offset: 0
    };
    const findOptions = getFindOptions(db, findOptionsKeys, args, {});
    expect(findOptions.limit).toEqual(expect.any(Number));
    expect(findOptions.where).toHaveProperty('tripStatus');
    expect(findOptions.where).toHaveProperty('custId');
    expect(findOptions.offset).toEqual(expect.any(Number));
    expect(findOptions).toHaveProperty('include');
    expect(findOptions.include[0].model).toEqual(db.completedRideModel);
    expect(findOptions).toHaveProperty('order');
    expect(Array.isArray(findOptions.order)).toBe(true);
    expect(Array.isArray(findOptions.attributes)).toBe(true);
  });

  it('should return findOptions that are used to query sequelize from graphql for incompleted rides', async () => {
    const db = {
      sequelize: {
        literal: jest.fn(val => val)
      },
      completedRideModel: 'completed_rides',
      incompleteRideModel: 'incomplete_rides'
    };
    const findOptionsKeys = {
      limit: 10,
      order: [['id', 'ASC']],
      where: {},
      offset: 0,
      attributes: [
        'id',
        'pickupLoc',
        'dropLoc',
        'dateOfRide',
        'bookingTime',
        'estFare',
        'estDistance',
        'tripStatus',
        'custId',
        'driverId',
        'createdAt',
        'updatedAt',
        'deletedAt',
        'cust_id',
        'driver_id'
      ],
      logging: undefined,
      graphqlContext: {}
    };
    const args = {
      limit: 10,
      order: 'id DESC',
      where: { tripStatus: 'CANCELLED', custId: 2 },
      offset: 0
    };
    // const findOptions = getFindOptionsMocked.getFindOptionsRequstedRides(db, findOptionsKeys, args, {});
    const findOptions = getFindOptions(db, findOptionsKeys, args, {});
    expect(findOptions.limit).toEqual(expect.any(Number));
    expect(findOptions.where).toHaveProperty('tripStatus');
    expect(findOptions.where).toHaveProperty('custId');
    expect(findOptions.offset).toEqual(expect.any(Number));
    expect(findOptions).toHaveProperty('include');
    expect(findOptions.include[0].model).toEqual(db.incompleteRideModel);
    expect(findOptions).toHaveProperty('order');
    expect(Array.isArray(findOptions.order)).toBe(true);
    expect(Array.isArray(findOptions.attributes)).toBe(true);
  });

  it('should return findOptions that are used to query sequelize from graphql for no customer id', async () => {
    const db = {
      sequelize: {
        literal: jest.fn(val => val)
      },
      completedRideModel: 'completed_rides',
      incompleteRideModel: 'incomplete_rides'
    };
    const findOptionsKeys = {
      limit: 10,
      order: [['id', 'ASC']],
      where: {},
      offset: 0,
      attributes: [
        'id',
        'pickupLoc',
        'dropLoc',
        'dateOfRide',
        'bookingTime',
        'estFare',
        'estDistance',
        'tripStatus',
        'custId',
        'driverId',
        'createdAt',
        'updatedAt',
        'deletedAt',
        'cust_id',
        'driver_id'
      ],
      logging: undefined,
      graphqlContext: {}
    };
    const args = {
      limit: 10,
      order: 'id DESC',
      where: { tripStatus: 'COMPLETED' },
      offset: 0
    };
    const findOptions = getFindOptions(db, findOptionsKeys, args, {});
    expect(findOptions).toEqual(false);
  });
});
