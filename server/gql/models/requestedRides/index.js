import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getNode } from '@gql/node';
import { createConnection, resolver } from 'graphql-sequelize';
import { timestamps } from '@gql/fields/timestamps';
import db from '@database/models';
import { totalConnectionFields } from '@utils/index';
import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';
import { GraphQLDate, GraphQLDateTime } from 'graphql-iso-date';
import moment from 'moment';
import _ from 'lodash';
import { sequelizedWhere } from '@server/database/dbUtils';

const { nodeInterface } = getNode();

export const requestedRidesFields = {
  pickupLoc: { type: new GraphQLNonNull(GraphQLString) },
  dropLoc: { type: new GraphQLNonNull(GraphQLString) },
  dateOfRide: { type: GraphQLDate },
  bookingTime: { type: GraphQLDateTime },
  estFare: { type: GraphQLFloat },
  estDistance: { type: new GraphQLNonNull(GraphQLFloat) },
  tripStatus: { type: GraphQLString },
  custId: { type: GraphQLInt },
  driverId: { type: GraphQLInt }
};

const GraphQLRequestedRides = new GraphQLObjectType({
  name: 'requestedRides',
  interfaces: [nodeInterface],
  fields: () => ({
    ...getQueryFields(requestedRidesFields, TYPE_ATTRIBUTES.isNonNull),
    id: { type: new GraphQLNonNull(GraphQLID) },
    ...timestamps
  })
});

const RequestedRidesConnection = createConnection({
  name: 'requestedRides',
  target: db.requestedRideModel,
  nodeType: GraphQLRequestedRides,
  ...totalConnectionFields,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    findOptions.where = sequelizedWhere(findOptions.where, args.where);
    return findOptions;
  }
});

export { GraphQLRequestedRides };

// queries on the requestedRides table.
export const requestedRideQueries = {
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: GraphQLRequestedRides,
    resolve: resolver(db.requestedRideModel)
  },
  model: db.requestedRideModel
};

// lists on the requestedRides table.
export const requestedRideLists = {
  list: {
    ...RequestedRidesConnection,
    resolve: RequestedRidesConnection.resolve,
    type: RequestedRidesConnection.connectionType,
    args: {
      ...RequestedRidesConnection.connectionArgs
    }
  },
  model: db.requestedRideModel
};

export const requestedRideMutations = {
  args: requestedRidesFields,
  type: GraphQLRequestedRides,
  model: db.requestedRideModel,
  customCreateResolver: async (model, args, ctx, info) => {
    args = {
      ...args,
      dateOfRide: moment(moment.now()).format('YYYY-MM-DD'),
      bookingTime: moment(moment.now()).format('YYYY-MM-DD HH:mm:ss'),
      estFare: (args.estDistance * _.random(10, 100)).toFixed(2),
      // tripStatus: TRIP_STATUS_TYPES.PENDING,
      createdAt: moment(moment.now()).format('YYYY-MM-DD HH:mm:ss')
    };
    return await model.create(args);
  }
};
