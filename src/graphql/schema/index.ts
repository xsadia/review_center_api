import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { QueryType } from "./QueryType";

export const schema = new GraphQLSchema({
    query: QueryType
});