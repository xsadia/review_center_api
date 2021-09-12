import { GraphQLObjectType, GraphQLString } from "graphql";

export const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'The root of all queries',
    fields: () => ({
        hi: {
            type: GraphQLString,
            resolve: () => {
                return 'Hello, world';
            }
        }
    })
});