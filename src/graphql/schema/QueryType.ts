import { GraphQLObjectType, GraphQLString } from "graphql";
import { User } from "../../models/User";
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
        }
    })
});