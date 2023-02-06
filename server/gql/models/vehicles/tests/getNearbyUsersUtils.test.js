import * as utils from '@gql/models/vehicles/getNearbyUsersUtils';

describe('handleAggregateQueries', () => {
  it('should return findOptions that are used to query sequelize from graphql', async () => {
    const db = {
      sequelize: {
        literal: jest.fn(),
        fn: jest.fn()
      }
    };
    const findOptionsKeys = {
      limit: 10,
      order: [['A', 'A']],
      where: {},
      offset: 10,
      attributes: [
        'id',
        'brand',
        'color',
        'vehicleNo',
        'type',
        'maxCapacity',
        'engineType',
        'insuranceNo',
        'insuranceExp',
        'driverId',
        'createdAt',
        'updatedAt',
        'deletedAt'
      ],
      logging: undefined,
      graphqlContext: {},
      include: []
    };
    const args = {
      points: '26.1564 75.6813',
      order: 'id DESC, brand DESC, vehicleNo DESC',
      where: { type: 'CAR' }
    };
    const getFindOptions = jest.spyOn(utils, 'getFindOptions');
    const findOptions = getFindOptions(db, findOptionsKeys, args, {});
    expect(findOptions.limit).toEqual(expect.any(Number));
    expect(findOptions.where).toHaveProperty('type');
    expect(findOptions.offset).toEqual(expect.any(Number));
    expect(findOptions).toHaveProperty('include');
    expect(findOptions).toHaveProperty('raw');
    expect(findOptions).toHaveProperty('nest');
    expect(findOptions).toHaveProperty('order');
    expect(Array.isArray(findOptions.order)).toBe(true);
    expect(Array.isArray(findOptions.attributes)).toBe(true);
  });
});
describe('queryOptions', () => {
  it('should return an array with elements such as [colName, order]', async () => {
    const formatOrderByClause = jest.spyOn(utils, 'formatForOrderByClause');
    const db = {
      sequelize: {
        literal: jest.fn(val => val)
      }
    };
    const args = 'id DESC, brand DESC, vehicleNo DESC';
    const orderedClause = formatOrderByClause(db, args);
    const firstElement = orderedClause[0];
    const firstCol = args.split(',')[0].split(' ')[0];
    const firstOrder = args.split(',')[0].split(' ')[1];
    expect(Array.isArray(orderedClause)).toBe(true);
    expect(firstElement[0]).toEqual(firstCol);
    expect(firstElement[1]).toEqual(firstOrder);
  });
});
