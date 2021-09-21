import { GraphQLBoolean, GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { Review } from "../../../models/Review";

export default mutationWithClientMutationId({
    name: 'DeleteReview',
    description: 'Delete review mutation',
    inputFields: {
        movieId: {
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    mutateAndGetPayload: async ({ movieId }, { user }) => {
        if (!user._id) {
            return {
                error: 'Permission denied',
                success: false
            };
        }

        const review = await Review.findOne({ movieId, userId: user._id });

        if (!review) {
            return {
                error: 'Review not found',
                success: false
            };
        }

        await review.delete();

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