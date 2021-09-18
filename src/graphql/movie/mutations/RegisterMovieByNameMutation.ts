import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { Movie } from "../../../models/Movie";
import { MovieType } from "../MovieType";
import axios from 'axios';
import { Genre } from "../../../models/Genre";

export default mutationWithClientMutationId({
    name: 'RegisterMovie',
    description: 'Register Movie Mutation',
    inputFields: {
        title: {
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    mutateAndGetPayload: async ({ title }, { user }) => {

        if (!user._id) {
            return {
                id: null,
                error: 'Permission denied'
            };
        }

        const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_KEY}&language=pt-BR&query=${title}`);

        if (response.data.results <= 0) {
            return {
                id: null,
                error: 'Movie not found'
            };
        }

        const data = response.data.results[0];

        const movieExists = await Movie.findOne({ tmdbId: data.id });

        if (movieExists) {
            return {
                id: null,
                error: 'Movie already registered'
            };
        }

        const movie = new Movie();

        for await (let id of data.genre_ids) {
            const genre = await Genre.findOne({ genreId: id });
            movie.genres.addToSet(genre._id);
        }

        movie.tmdbId = data.id;
        movie.title = data.title;
        movie.firstAirDate = new Date(data.release_date);
        movie.overview = data.overview;
        movie.posterPath = `https://image.tmdb.org/t/p/w500${data.poster_path}`;

        await movie.save();

        return {
            id: movie._id,
            error: null
        };
    },
    outputFields: {
        movie: {
            type: MovieType,
            resolve: async ({ id }) => {
                const movie = await Movie.findOne({ _id: id });

                return movie;
            }
        },
        error: {
            type: GraphQLString,
            resolve: ({ error }) => error
        }
    }
});