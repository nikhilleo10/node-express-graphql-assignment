import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getNode } from '@gql/node';
import { createConnection, resolver } from 'graphql-sequelize';
import { timestamps } from '@gql/fields/timestamps';
import db from '@database/models';
import { totalConnectionFields } from '@utils/index';
import { sequelizedWhere } from '@database/dbUtils';
import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';
import { GraphQLDate } from 'graphql-iso-date';
import { GraphQLUser } from '../users';

const { nodeInterface } = getNode();

export const driverFields = {
  dlNo: { type: new GraphQLNonNull(GraphQLString) },
  dlExpiry: { type: new GraphQLNonNull(GraphQLDate) },
  averageRating: { type: GraphQLFloat },
  userId: { type: new GraphQLNonNull(GraphQLInt) }
};

const GraphQLDriver = new GraphQLObjectType({
  name: 'driver',
  interfaces: [nodeInterface],
  fields: () => ({
    ...getQueryFields(driverFields, TYPE_ATTRIBUTES.isNonNull),
    id: { type: new GraphQLNonNull(GraphQLID) },
    ...timestamps,
    user: {
      type: GraphQLUser
      // resolve: (source, args, context, info) => {
      //   args.id = source.dataValues.userId;
      //   return userQueries.query.resolve(source, args, { ...context, store: source.dataValues }, info);
      // }
      // Keeping this code for future reference
    }
  })
});

const DriverConnection = createConnection({
  name: 'driver',
  target: db.driverModel,
  nodeType: GraphQLDriver,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    findOptions.where = sequelizedWhere(findOptions.where, args.where);
    return findOptions;
  },
  ...totalConnectionFields
});

export { GraphQLDriver };

// queries on the driver table.
export const driverQueries = {
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: GraphQLDriver,
    resolve: resolver(db.driverModel)
  },
  model: db.driverModel
};

// lists on the driver table.
export const driverLists = {
  list: {
    ...DriverConnection,
    resolve: DriverConnection.resolve,
    type: DriverConnection.connectionType,
    args: DriverConnection.connectionArgs
  },
  model: db.driverModel
};

export const driverMutations = {
  args: driverFields,
  type: GraphQLDriver,
  model: db.driverModel
};
