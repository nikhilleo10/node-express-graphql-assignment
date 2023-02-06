import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';

export const customListArgs = {
  limit: {
    type: new GraphQLNonNull(GraphQLInt),
    description: 'Use with offset to get paginated results with total'
  },
  offset: {
    type: new GraphQLNonNull(GraphQLInt),
    description: 'Use with offset to get paginated results with total'
  },
  order: {
    type: new GraphQLNonNull(GraphQLString),
    description: 'Order by is required.'
  },
  before: { type: GraphQLInt, description: 'Use with grapql-relay compliant queries' },
  after: { type: GraphQLInt, description: 'Use with grapql-relay compliant queries' },
  first: { type: GraphQLInt, description: 'Use with grapql-relay compliant queries' },
  last: { type: GraphQLInt, description: 'Use with grapql-relay compliant queries' }
};
