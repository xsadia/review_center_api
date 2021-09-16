import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { Movie } from "../../models/Movie";
import { User } from "../../models/User";
import { MovieType } from "../movie/MovieType";
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
            resolve: async (root, { id }, ctx) => {
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
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (root, { name }, ctx) => {
                const movie = await Movie.findOne({
                    $text: {
                        $search: name,
                        $language: "pt",
                        $caseSensitive: false,
                        $diacriticSensitive: false
                    }
                });

                if (!movie) {
                    const movie = null;
                    return movie;
                }

                return movie;
            }
        }
    })
});