import { GraphQLBoolean, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { User } from "../../../models/User";

export default mutationWithClientMutationId({
    name: 'DeleteUser',
    inputFields: {},
    mutateAndGetPayload: async (_, { user }) => {
        if (!user) {
            return {
                success: false,
                error: 'Permission denied'
            };
        }

        const userToBeDeleted = await User.findOne({ _id: user._id });

        if (!userToBeDeleted) {
            return {
                success: false,
                error: 'User not found'
            };
        }

        await userToBeDeleted.delete();

        return {
            success: true,
            error: null
        };
    },
    outputFields: {
        success: {
            type: GraphQLBoolean,
            resolve: ({ success }) => success
        },
        error: {
            type: GraphQLString,
            resolve: ({ error }) => error
        }
    }
});