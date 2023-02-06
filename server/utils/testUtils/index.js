import isNil from 'lodash/isNil';
import set from 'lodash/set';
import { driverTable, requestedRidesTable, userTable, vehicleTable } from '@server/utils/testUtils/mockData';
import sequelize from 'sequelize';
import request from 'supertest';
import logger from '@middleware/logger/index';

const defineAndAddAttributes = (connection, name, mock, attr, total = 10) => {
  const mockTable = connection.define(name, mock, {
    instanceMethods: {
      findAll: () => [mock],
      findOne: () => mock
    }
  });
  mockTable.rawAttributes = attr;
  mockTable.manyFromSource = { count: () => new Promise(resolve => resolve(total)) };
  set(mockTable, 'sequelize.dialect', { name: 'mysql2' });
  set(mockTable, 'sequelize', connection);
  set(mockTable, 'sequelize.literal', sequelize.literal);
  return mockTable;
};

export const restfulGetResponse = async (path, app) => {
  if (!app) {
    app = await require('@server/utils/testUtils/testApp').getTestApp();
  }
  return await request(app)
    .get(path)
    .set('Accept', 'application/json');
};

export const getResponse = async (query, app) => {
  if (!app) {
    app = await require('@server/utils/testUtils/testApp').getTestApp();
  }
  return await request(app)
    .post('/graphql')
    .type('application/json')
    .send({ query })
    .set('Accept', 'application/json');
};

export function mockDBClient(config = { total: 10 }) {
  const SequelizeMock = require('sequelize-mock');
  // Setup the mock database connection
  const dbConnectionMock = new SequelizeMock();
  dbConnectionMock.dialect = { name: 'mysql2' };
  dbConnectionMock.literal = sequelize.literal;
  dbConnectionMock.fn = sequelize.fn;

  const vehicleMock = defineAndAddAttributes(
    dbConnectionMock,
    'vehicle',
    vehicleTable[0],
    require('@database/models/vehicle').getAttributes(sequelize, sequelize.DataTypes),
    config.total
  );

  const userMock = defineAndAddAttributes(
    dbConnectionMock,
    'user',
    userTable[0],
    require('@database/models/user').getAttributes(sequelize, sequelize.DataTypes),
    config.total
  );

  const driverMock = defineAndAddAttributes(
    dbConnectionMock,
    'driver',
    driverTable[0],
    require('@database/models/driver').getAttributes(sequelize, sequelize.DataTypes),
    config.total
  );

  const requestedRideMock = defineAndAddAttributes(
    dbConnectionMock,
    'requested_rides',
    requestedRidesTable[0],
    require('@database/models/requestedRides').getAttributes(sequelize, sequelize.DataTypes),
    config.total
  );

  return {
    client: dbConnectionMock,
    models: {
      vehicleModel: vehicleMock,
      userModel: userMock,
      driverModel: driverMock,
      requestedRideModel: requestedRideMock,
      sequelize: dbConnectionMock
    }
  };
}

export async function connectToMockDB() {
  const client = mockDBClient();
  try {
    client.authenticate();
  } catch (error) {
    logger().error(error);
  }
}

export const resetAndMockDB = (mockCallback, config, db) => {
  if (!db) {
    db = mockDBClient(config);
  }
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.resetModules();
  jest.doMock('@database', () => {
    if (mockCallback) {
      mockCallback(db.client, db.models);
    }
    return { getClient: () => db.client, client: db.client, connect: () => {} };
  });
  jest.doMock('@database/models', () => {
    if (mockCallback) {
      mockCallback(db.client, db.models);
    }
    return db.models;
  });
  return db.client;
};
export const createFieldsWithType = fields => {
  const fieldsWithType = [];
  Object.keys(fields).forEach(key => {
    fieldsWithType.push({
      name: key,
      type: {
        name: fields[key].type
      }
    });
  });
  return fieldsWithType;
};

const getExpectedField = (expectedFields, name) => expectedFields.filter(field => field.name === name);

export const expectSameTypeNameOrKind = (result, expected) =>
  result.filter(field => {
    const expectedField = getExpectedField(expected, field.name)[0];
    // @todo check for connection types.
    if (!isNil(expectedField)) {
      return expectedField.type.name === field.type.name || expectedField.type.kind === field.type.kind;
    }
    return false;
  }).length === 0;
