import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { connectionArgs, connectionDefinitions, connectionFromArray, globalIdField } from "graphql-relay";
import { Review } from "../../models/Review";
import { nodeInterface } from "../node/nodeDefinition";
import { ReviewConnection } from "../review/ReviewType";

export const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'User type',
    fields: () => ({
        id: globalIdField('User'),
        username: {
            type: GraphQLString,
            resolve: ({ username }) => username
        },
        email: {
            type: GraphQLString,
            resolve: ({ email }) => email
        },
        password: {
            type: GraphQLString,
            resolve: ({ password }) => password
        },
        reviews: {
            type: ReviewConnection,
            args: connectionArgs,
            resolve: async (user, args, context) => {
                const reviews = await Review.find({ userId: user._id });

                return connectionFromArray(reviews, args);
            }
        },
        createdAt: {
            type: GraphQLString,
            resolve: ({ createdAt }) => createdAt
        }
    }),
    interfaces: () => [nodeInterface]
});

const { connectionType: UserConnection, edgeType: UserEdge } = connectionDefinitions({
    name: 'User',
    nodeType: UserType
});

export {
    UserConnection,
    UserEdge
};