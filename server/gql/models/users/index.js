import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getNode } from '@gql/node';
import { createConnection, resolver } from 'graphql-sequelize';
import { timestamps } from '@gql/fields/timestamps';
import db from '@database/models';
import { totalConnectionFields } from '@utils/index';
import { sequelizedWhere } from '@database/dbUtils';
import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';

const { nodeInterface } = getNode();

export const userFields = {
  firstName: { type: new GraphQLNonNull(GraphQLString) },
  lastName: { type: new GraphQLNonNull(GraphQLString) },
  typeOfUser: { type: new GraphQLNonNull(GraphQLString) },
  distance_in_km: { type: GraphQLFloat },
  email: { type: new GraphQLNonNull(GraphQLString) },
  dateOfBirth: { type: new GraphQLNonNull(GraphQLString) }
};

const GraphQLUser = new GraphQLObjectType({
  name: 'user',
  interfaces: [nodeInterface],
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    ...getQueryFields(userFields, TYPE_ATTRIBUTES.isNonNull),
    ...timestamps
  })
});

const UserConnection = createConnection({
  name: 'user',
  target: db.userModel,
  nodeType: GraphQLUser,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    findOptions.where = sequelizedWhere(findOptions.where, args.where);
    return findOptions;
  },
  ...totalConnectionFields
});

export { GraphQLUser };

// queries on the users table.
export const userQueries = {
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: GraphQLUser,
    resolve: resolver(db.userModel)
  },
  model: db.userModel
};

// lists on the users table.
export const userLists = {
  list: {
    ...UserConnection,
    resolve: UserConnection.resolve,
    type: UserConnection.connectionType,
    args: UserConnection.connectionArgs
  },
  model: db.userModel
};

export const userMutations = {
  args: userFields,
  type: GraphQLUser,
  model: db.userModel
};
