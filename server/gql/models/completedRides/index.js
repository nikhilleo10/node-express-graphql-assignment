import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getNode } from '@gql/node';
import { timestamps } from '@gql/fields/timestamps';
import db from '@database/models';
import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';
import { endRide } from '@server/database/dbUtils';
import { updateRideOptions } from '@server/utils/constants';

const { nodeInterface } = getNode();

export const completedRidesFields = {
  actualFare: { type: GraphQLFloat },
  tip: { type: GraphQLFloat },
  tripId: { type: GraphQLInt }
};

const GraphQLCompletedRides = new GraphQLObjectType({
  name: 'completedRides',
  interfaces: [nodeInterface],
  fields: () => ({
    ...getQueryFields(completedRidesFields, TYPE_ATTRIBUTES.isNonNull),
    id: { type: new GraphQLNonNull(GraphQLID) },
    ...timestamps
  })
});

export { GraphQLCompletedRides };

// queries on the requestedRides table.
export const completedRideMutations = {
  args: {
    ...completedRidesFields,
    updateType: { type: GraphQLString },
    id: { type: GraphQLID }
  },
  type: GraphQLCompletedRides,
  model: db.completedRideModel,
  customUpdateResolver: async (model, args, ctx, info) => {
    switch (args.updateType) {
      case updateRideOptions.END_A_RIDE:
        delete args.updateType;
        return await endRide(model, args);
    }
  }
};
