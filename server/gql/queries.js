import { GraphQLObjectType, GraphQLNonNull, GraphQLInt } from 'graphql';
import camelCase from 'lodash/camelCase';
import pluralize from 'pluralize';
import { defaultListArgs, defaultArgs } from 'graphql-sequelize';
import { getNode } from '@gql/node';
import { getGqlModels } from '@server/utils/autogenHelper';
import { customListArgs } from '@gql/fields/args';

const { nodeField } = getNode();
const DB_TABLES_QUERIES = getGqlModels({
  type: 'Queries',
  blacklist: ['aggregate', 'timestamps', 'completedRides', 'incompleteRides']
});
export const addQueries = () => {
  const query = {};
  Object.keys(DB_TABLES_QUERIES).forEach(table => {
    query[camelCase(table)] = {
      ...DB_TABLES_QUERIES[table].query,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        ...DB_TABLES_QUERIES[table].args,
        ...defaultArgs(DB_TABLES_QUERIES[table].model)
      }
    };
  });
  return query;
};
const DB_TABLES_LISTS = getGqlModels({
  type: 'Lists',
  blacklist: ['aggregate', 'timestamps', 'completedRides', 'incompleteRides']
});
export const addLists = () => {
  const list = {};
  Object.keys(DB_TABLES_LISTS).forEach(table => {
    list[pluralize(camelCase(table))] = {
      ...DB_TABLES_LISTS[table].list,
      args: {
        ...DB_TABLES_LISTS[table].list?.args,
        ...defaultListArgs(DB_TABLES_LISTS[table].model),
        ...customListArgs
      }
    };
  });
  return list;
};

export const QueryRoot = new GraphQLObjectType({
  name: 'Query',
  node: nodeField,
  fields: () => ({
    ...addQueries(),
    ...addLists()
  })
});
