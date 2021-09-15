import { GraphQLObjectType } from "graphql";
import UserMutations from '../user/mutations';

export const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root of all mutations',
    fields: () => ({
        ...UserMutations
    })
});