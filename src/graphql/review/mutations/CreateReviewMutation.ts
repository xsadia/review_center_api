import { GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import { mutationWithClientMutationId } from "graphql-relay";
import { Movie } from '../../../models/Movie';
import { Review } from '../../../models/Review';
import { ReviewType } from '../ReviewType';

export default mutationWithClientMutationId({
    name: 'CreateReview',
    description: 'Create review mutation',
    inputFields: {
        review: {
            type: new GraphQLNonNull(GraphQLString),
        },
        score: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        movieId: {
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    mutateAndGetPayload: async ({ review, score, movieId }, { user }) => {
        if (!user._id) {
            return {
                id: null,
                error: 'Permission denied'
            };
        }

        const alreadyReviewed = await Review.findOne({ movieId, userId: user._id });

        if (alreadyReviewed) {
            return {
                id: null,
                error: 'You\'ve already reviewed this movie'
            };
        }

        const movieExists = await Movie.findOne({ _id: movieId });

        if (!movieExists) {
            return {
                id: null,
                error: 'Movie not found'
            };
        }

        const newReview = new Review({
            review,
            score,
            movieId,
            userId: user._id
        });

        movieExists.reviews.addToSet(newReview._id);

        await newReview.save();
        await movieExists.save();

        return {
            id: newReview._id,
            error: null
        };
    },
    outputFields: {
        review: {
            type: ReviewType,
            resolve: async ({ id }) => {
                const review = await Review.findOne({ _id: id });

                return review;
            }
        },
        error: {
            type: GraphQLString,
            resolve: ({ error }) => error
        }
    }
});