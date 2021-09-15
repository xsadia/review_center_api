import { verify } from "jsonwebtoken";
import { Context, Next } from "koa";
import { authConfig } from "../config/authConfig";

type TokenPayload = {
    iat: number;
    exp: number;
    sub: string;
};

export const authMiddleware = async (ctx: Context, next: Next) => {
    const authorizationHeader = ctx.header.authorization;

    if (!authorizationHeader) {
        ctx.user = {
            _id: null
        };

        return await next();
    }

    const [, token] = authorizationHeader.split(' ');

    try {
        const decoded = verify(token, authConfig.jwt.secret);

        const { sub } = decoded as TokenPayload;

        ctx.user = {
            _id: sub
        };

        return await next();
    } catch {
        ctx.user = {
            _id: null
        };

        return await next();
    }
};