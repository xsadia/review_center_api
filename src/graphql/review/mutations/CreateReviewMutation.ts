import { GraphQLNonNull, GraphQLString, GraphQLFloat } from "graphql";
import {
  fromGlobalId,
  mutationWithClientMutationId,
  toGlobalId,
} from "graphql-relay";
import { Movie } from "../../../models/Movie";
import { Review } from "../../../models/Review";
import { ReviewEdge } from "../ReviewType";

export default mutationWithClientMutationId({
  name: "CreateReview",
  description: "Create review mutation",
  inputFields: {
    review: {
      type: new GraphQLNonNull(GraphQLString),
    },
    score: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    movieId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ review, score, movieId }, { user }) => {
    if (!user._id) {
      return {
        id: null,
        error: "Permission denied",
      };
    }

    const { id } = fromGlobalId(movieId);

    const alreadyReviewed = await Review.findOne({
      movieId: id,
      userId: user._id,
    });

    if (alreadyReviewed) {
      return {
        id: null,
        error: "You've already reviewed this movie",
      };
    }

    const movieExists = await Movie.findOne({ _id: id });

    if (!movieExists) {
      return {
        id: null,
        error: "Movie not found",
      };
    }

    const newReview = new Review({
      review,
      score: Number(score),
      movieId: id,
      userId: user._id,
    });

    movieExists.reviews.addToSet(newReview._id);

    await newReview.save();
    await movieExists.save();

    return {
      id: newReview._id,
      error: null,
    };
  },
  outputFields: {
    review: {
      type: ReviewEdge,
      resolve: async ({ id }) => {
        const review = await Review.findOne({ _id: id });

        if (!review) {
          return null;
        }

        return {
          cursor: toGlobalId("Review", review._id),
          node: review,
        };
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
