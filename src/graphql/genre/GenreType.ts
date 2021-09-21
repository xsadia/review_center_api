import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { connectionDefinitions, globalIdField } from "graphql-relay";
import { nodeInterface } from "../node/nodeDefinition";

export const GenreType = new GraphQLObjectType({
    name: 'Genre',
    description: 'Genre Type',
    fields: () => ({
        id: globalIdField('Genre'),
        _id: {
            type: GraphQLString,
            resolve: ({ _id }) => _id
        },
        genreId: {
            type: GraphQLInt,
            resolve: ({ genreId }) => genreId
        },
        genreName: {
            type: GraphQLString,
            resolve: ({ genreName }) => genreName
        }
    }),
    interfaces: () => [nodeInterface]
});

const { connectionType: GenreConnection, edgeType: GenreEdge } = connectionDefinitions({
    name: 'Genre',
    nodeType: GenreType
});

export { GenreConnection, GenreEdge };