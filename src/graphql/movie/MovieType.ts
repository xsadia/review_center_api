import { GraphQLFloat, GraphQLObjectType, GraphQLString } from "graphql";
import { connectionArgs, connectionDefinitions, connectionFromArray, globalIdField } from "graphql-relay";
import { Genre } from "../../models/Genre";
import { Movie } from "../../models/Movie";
import { Review } from "../../models/Review";
import { GenreConnection } from "../genre/GenreType";
import { nodeInterface } from "../node/nodeDefinition";
import { ReviewConnection } from "../review/ReviewType";

export const MovieType = new GraphQLObjectType({
    name: 'Movie',
    description: 'Movie type',
    fields: () => ({
        id: globalIdField('Movie'),
        _id: {
            type: GraphQLString,
            resolve: ({ _id }) => _id
        },
        tmdbId: {
            type: GraphQLString,
            resolve: ({ tmdbId }) => tmdbId
        },
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
        genres: {
            type: GenreConnection,
            args: connectionArgs,
            resolve: async (movie, args, context) => {
                const movieFound = await Movie.findOne({ _id: movie._id });
                const genres = [];

                for await (let id of movieFound.genres) {
                    const genreFromCollection = await Genre.findOne({ _id: id });
                    genres.push(genreFromCollection);
                }

                return connectionFromArray(genres, args);
            }
        },
        reviews: {
            type: ReviewConnection,
            args: connectionArgs,
            resolve: async (movie, args, context) => {
                const reviews = await Review.find({ movieId: movie._id });

                return connectionFromArray(reviews, args);
            }
        },
        posterPath: {
            type: GraphQLString,
            resolve: ({ posterPath }) => posterPath
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