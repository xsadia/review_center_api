import { GraphQLFloat, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
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
            type: new GraphQLNonNull(GraphQLString),
            resolve: ({ review }) => review
        },
        score: {
            type: new GraphQLNonNull(GraphQLFloat),
            resolve: ({ score }) => score
        },
        userId: {
            type: new GraphQLNonNull(UserType),
            resolve: ({ userId }) => userId
        },
        movieId: {
            type: new GraphQLNonNull(MovieType),
            resolve: ({ movieId }) => movieId
        },
        createdAt: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: ({ createdAt }) => createdAt
        },
        deletedAt: {
            type: new GraphQLNonNull(GraphQLString),
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