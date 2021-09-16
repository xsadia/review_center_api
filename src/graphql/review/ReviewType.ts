import { GraphQLFloat, GraphQLObjectType, GraphQLString } from "graphql";
import { connectionDefinitions, globalIdField } from "graphql-relay";
import { MovieType } from "../movie/MovieType";
import { nodeInterface } from "../node/nodeDefinition";
import { UserType } from "../user/UserType";

export const ReviewType = new GraphQLObjectType({
    name: 'Review',
    description: 'Review Type',
    fields: () => ({
        id: globalIdField('Review'),
        review: {
            type: GraphQLString,
            resolve: ({ review }) => review
        },
        score: {
            type: GraphQLFloat,
            resolve: ({ score }) => score
        },
        userId: {
            type: UserType,
            resolve: ({ userId }) => userId
        },
        movieId: {
            type: MovieType,
            resolve: ({ movieId }) => movieId
        },
        createdAt: {
            type: GraphQLString,
            resolve: ({ createdAt }) => createdAt
        },
        deletedAt: {
            type: GraphQLString,
            resolve: ({ deletedAt }) => deletedAt
        }
    }),
    interfaces: () => [nodeInterface]
});

const { connectionType: ReviewConnection, edgeType: ReviewEdge } = connectionDefinitions({
    name: 'Review',
    nodeType: ReviewType
});

export {
    ReviewConnection,
    ReviewEdge
};