import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { connectionArgs, connectionFromArray, fromGlobalId } from "graphql-relay";
import { Genre } from "../../models/Genre";
import { Movie } from "../../models/Movie";
import { User } from "../../models/User";
import { GenreConnection } from "../genre/GenreType";
import { MovieConnection, MovieType } from "../movie/MovieType";
import { UserType } from "../user/UserType";

export const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'The root of all queries',
    fields: () => ({
        hi: {
            type: GraphQLString,
            resolve: () => {
                return 'Hello, world';
            }
        },
        me: {
            type: UserType,
            description: 'Recover logged user\'s informations',
            resolve: async (root, args, { user }) => {

                if (!user) {
                    const me = null;
                    return me;
                }

                const me = await User.findOne({ _id: user._id });

                if (!me) {
                    const me = null;
                    return me;
                }

                return me;
            }
        },
        movieById: {
            type: MovieType,
            description: 'Query for a movie by ID',
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (root, { id: globalId }, ctx) => {

                const { id } = fromGlobalId(globalId);

                const movie = await Movie.findOne({ _id: id });

                if (!movie) {
                    const movie = null;
                    return movie;
                }

                return movie;
            }
        },
        movieByName: {
            type: MovieType,
            description: 'Query for a movie by name',
            args: {
                title: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (root, { title }, ctx) => {

                const movie = await Movie.findOne({ title: { $regex: ".*" + title + ".*", $options: 'i' } });

                if (!movie) {
                    const movie = null;
                    return movie;
                }

                return movie;
            }
        },
        movies: {
            type: MovieConnection,
            args: connectionArgs,
            resolve: async (root, args, ctx) => {
                const movies = await Movie.find();
                return connectionFromArray(movies, args);
            }
        },
        moviesByGenre: {
            type: MovieConnection,
            args: {
                ...connectionArgs,
                genreId: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (root, args, ctx) => {
                const genre = await Genre.findOne({ _id: args.genreId });

                const movies = await Movie.find({ genres: genre._id });

                return connectionFromArray(movies, {
                    after: args.after,
                    before: args.before,
                    first: args.first,
                    last: args.last
                });
            }
        },
        genres: {
            type: GenreConnection,
            args: connectionArgs,
            resolve: async (root, args, ctx) => {
                const genres = await Genre.find();

                return connectionFromArray(genres, args);
            }
        }
    })
});