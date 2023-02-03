import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getNode } from '@gql/node';
import { createConnection, resolver } from 'graphql-sequelize';
import { timestamps } from '@gql/fields/timestamps';
import db from '@database/models';
import { totalConnectionFields } from '@utils/index';
import { sequelizedWhere } from '@database/dbUtils';
import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';
import { GraphQLDriver } from '../drivers';
import { TYPE_OF_VEHICLE_ENUM_VALUES, TYPE_OF_ENGINE_ENUM_VALUES } from '@server/utils/constants';

const { nodeInterface } = getNode();

export const vehicleFields = {
  brand: { type: new GraphQLNonNull(GraphQLString) },
  color: { type: new GraphQLNonNull(GraphQLString) },
  vehicleNo: { type: new GraphQLNonNull(GraphQLString) },
  type: { type: new GraphQLNonNull(TYPE_OF_VEHICLE_ENUM_VALUES) },
  maxCapacity: { type: new GraphQLNonNull(GraphQLInt) },
  engineType: { type: new GraphQLNonNull(TYPE_OF_ENGINE_ENUM_VALUES) },
  insuranceNo: { type: new GraphQLNonNull(GraphQLString) },
  insuranceExp: { type: new GraphQLNonNull(GraphQLString) }
};

const GraphQLVehicle = new GraphQLObjectType({
  name: 'vehicle',
  interfaces: [nodeInterface],
  fields: () => ({
    ...getQueryFields(vehicleFields, TYPE_ATTRIBUTES.isNonNull),
    id: { type: new GraphQLNonNull(GraphQLID) },
    ...timestamps,
    driver: { type: GraphQLDriver }
  })
});

const VehicleConnection = createConnection({
  name: 'vehicle',
  target: db.vehicleModel,
  nodeType: GraphQLVehicle,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    if (args.points) {
      const cooridnates = args.points.split(' ');
      const locationSql = db.sequelize.literal(`ST_GeomFromText('POINT(${cooridnates[0]} ${cooridnates[1]})')`);
      findOptions.include.push({
        model: db.driverModel,
        as: 'driver',
        include: [
          {
            model: db.userModel,
            as: 'user',
            attributes: [
              'firstName',
              'lastName',
              'typeOfUser',
              'email',
              'dateOfBirth',
              'id',
              [db.sequelize.fn('ST_Distance_Sphere', db.sequelize.literal('location'), locationSql), 'distance_in_km']
            ]
          }
        ]
      });
    }
    findOptions.raw = true;
    findOptions.nest = true;
    findOptions.where = sequelizedWhere(findOptions.where, args.where);
    return findOptions;
  },
  after: (result, args, context) => {
    const edges = result.edges.map(item => {
      item.node.driver.user.distance_in_km = (item.node.driver.user.distance_in_km / 1000).toFixed(4);
      return item;
    });
    result.edges = edges;
    return result;
  },
  ...totalConnectionFields
});

export { GraphQLVehicle };

// queries on the vehicle table.
export const vehicleQueries = {
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: GraphQLVehicle,
    resolve: resolver(db.vehicleModel, {
      before: (findOptions, args, ctx) => {
        findOptions.include = findOptions.include || [];
        findOptions.include.push({
          model: db.driverModel
        });
        return findOptions;
      }
    })
  },
  model: db.vehicleModel
};

// lists on the vehicle table.
export const vehicleLists = {
  list: {
    ...VehicleConnection,
    resolve: VehicleConnection.resolve,
    type: VehicleConnection.connectionType,
    args: {
      ...VehicleConnection.connectionArgs,
      points: { type: new GraphQLNonNull(GraphQLString), description: 'Points are required to get nearby rides.' }
    }
  },
  model: db.vehicleModel
};

export const vehicleMutations = {
  args: vehicleFields,
  type: GraphQLVehicle,
  model: db.vehicleModel
};
