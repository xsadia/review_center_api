import { GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import axios from 'axios';
import { Movie } from "../../../models/Movie";
import { Genre } from "../../../models/Genre";
import { MovieType } from "../MovieType";

export default mutationWithClientMutationId({
    name: 'RegisterMovieById',
    description: 'Register movie by ID mutation',
    inputFields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    },
    mutateAndGetPayload: async ({ id }, { user }) => {
        if (!user._id) {
            return {
                id: null,
                error: 'Permission denied'
            };
        }

        const movieExists = await Movie.findOne({ tmdbId: id });

        if (movieExists) {
            return {
                id: null,
                error: 'Movie already registered'
            };
        }

        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_KEY}&language=pt-BR`);

        if (response.data.success === false) {
            return {
                id: null,
                error: 'Movie not found'
            };
        }

        const data = response.data;

        const movie = new Movie();

        for await (let genreFromFetch of data.genres) {
            const genre = await Genre.findOne({ genreId: genreFromFetch.id });
            movie.genres.addToSet(genre._id);
        }

        movie.tmdbId = data.id;
        movie.title = data.title.toLowerCase();
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