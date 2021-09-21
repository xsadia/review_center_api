import { GraphQLObjectType } from "graphql";
import UserMutations from '../user/mutations';
import MovieMutations from '../movie/mutations';
import GenreMutations from '../genre/mutations';
import ReviewMutations from '../review/mutations';

export const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root of all mutations',
    fields: () => ({
        ...UserMutations,
        ...MovieMutations,
        ...GenreMutations,
        ...ReviewMutations
    })
});