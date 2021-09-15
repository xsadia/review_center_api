import { compare } from "bcryptjs";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { sign } from "jsonwebtoken";
import { authConfig } from "../../../config/authConfig";
import { User } from "../../../models/User";
import { UserType } from "../UserType";

export default mutationWithClientMutationId({
    name: 'AuthUser',
    description: 'Authenticate User Mutation',
    inputFields: {
        email: {
            type: new GraphQLNonNull(GraphQLString)
        },
        password: {
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    mutateAndGetPayload: async ({ email, password }) => {
        const user = await User.findOne({ email });

        if (!user) {
            return {
                id: null,
                token: null,
                error: 'Incorrect e-mail/password combination'
            };
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            return {
                id: null,
                token: null,
                error: 'Incorrect e-mail/password combination'
            };
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: user._id.toString(),
            expiresIn
        });

        return {
            id: user._id,
            token,
            error: null
        };
    },
    outputFields: {
        me: {
            type: UserType,
            resolve: async ({ id }) => {
                const user = await User.findOne({ _id: id });

                return user;
            }
        },
        token: {
            type: GraphQLString,
            resolve: ({ token }) => token
        },
        error: {
            type: GraphQLString,
            resolve: ({ error }) => error
        }
    }
});