import { GraphQLFloat, GraphQLObjectType, GraphQLString } from "graphql";
import { connectionArgs, connectionDefinitions, connectionFromArray, globalIdField } from "graphql-relay";
import { Review } from "../../models/Review";
import { nodeInterface } from "../node/nodeDefinition";
import { ReviewConnection } from "../review/ReviewType";

export const MovieType = new GraphQLObjectType({
    name: 'Movie',
    description: 'Movie type',
    fields: () => ({
        id: globalIdField('Movie'),
        title: {
            type: GraphQLString,
            resolve: ({ title }) => title
        },
        firstAirDate: {
            type: GraphQLString,
            resolve: ({ firstAirDate }) => firstAirDate
        },
        overview: {
            type: GraphQLString,
            resolve: ({ overview }) => overview
        },
        score: {
            type: GraphQLFloat,
            resolve: ({ score }) => score
        },
        reviews: {
            type: ReviewConnection,
            args: connectionArgs,
            resolve: async (movie, args, context) => {
                const reviews = await Review.find({ movieId: movie._id });

                return connectionFromArray(reviews, args);
            }
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

const { connectionType: MovieConnection, edgeType: MovieEdge } = connectionDefinitions({
    name: 'Movie',
    nodeType: MovieType
});

export { MovieConnection, MovieEdge };