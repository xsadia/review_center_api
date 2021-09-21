import axios from "axios";
import { GraphQLBoolean, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { Genre } from "../../../models/Genre";

export default mutationWithClientMutationId({
    name: 'PopulateGenres',
    description: 'Populate Genres Mutation',
    inputFields: {},
    mutateAndGetPayload: async (_, { user }) => {
        if (!user._id) {
            return {
                error: 'Permission denied',
                success: false
            };
        }

        const genresAlreadyPopulated = await Genre.findOne();

        if (genresAlreadyPopulated) {
            return {
                error: 'Genres already populated',
                success: false
            };
        }

        const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_KEY}&language=pt-BR`);
        const genres = response.data.genres;

        genres.forEach(async (genreInfo) => {
            const genre = new Genre({
                genreId: genreInfo.id,
                genreName: genreInfo.name
            });

            await genre.save();
        });

        return {
            error: null,
            success: true
        };
    },
    outputFields: {
        error: {
            type: GraphQLString,
            resolve: ({ error }) => error
        },
        success: {
            type: GraphQLBoolean,
            resolve: ({ success }) => success
        }
    }
});