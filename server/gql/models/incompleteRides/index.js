import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getNode } from '@gql/node';
import { timestamps } from '@gql/fields/timestamps';
import db from '@database/models';
import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';
import { cancelRide } from '@server/database/dbUtils';
import { updateRideOptions } from '@server/utils/constants';
import { GraphQLDateTime } from 'graphql-iso-date';

const { nodeInterface } = getNode();

export const incompleteRidesFields = {
  reasonForCancellation: { type: GraphQLString },
  tripId: { type: GraphQLInt },
  cancellationTime: { type: GraphQLDateTime }
};

const GraphQLIncompleteRides = new GraphQLObjectType({
  name: 'incompleteRides',
  interfaces: [nodeInterface],
  fields: () => ({
    ...getQueryFields(incompleteRidesFields, TYPE_ATTRIBUTES.isNonNull),
    id: { type: new GraphQLNonNull(GraphQLID) },
    ...timestamps
  })
});

export { GraphQLIncompleteRides };

// queries on the requestedRides table.
export const incompleteRideMutations = {
  args: {
    ...incompleteRidesFields,
    updateType: { type: GraphQLString }
  },
  type: GraphQLIncompleteRides,
  model: db.completedRideModel,
  customCreateResolver: async (model, args, ctx, info) => {
    switch (args.updateType) {
      case updateRideOptions.CANCEL_A_RIDE:
        delete args.updateType;
        return await cancelRide(model, args);
    }
  }
};
