import Koa from 'koa';
import convert from 'koa-convert';
import cors from 'koa-cors';
import Router from 'koa-router';
import graphqlHTTP from 'koa-graphql';
import bodyParser from 'koa-bodyparser';
import { schema } from './graphql/schema';
import dotenv from 'dotenv';

dotenv.config();
const isDev = !!process.env.DEVELOPMENT;

const app = new Koa();
const router = new Router();

const graphqlSettingsPerReq = async (req) => {
    //const { user } = await getUser(req.header.authorization);

    return {
        graphiql: isDev,
        schema,
        context: {
            req,
        },
        formatError: (error) => {
            console.log(error.message);
            console.log(error.locations);
            console.log(error.stack);

            return {
                message: error.message,
                locations: error.locations,
                stack: error.stack,
            };
        },
    };
};

const graphqlServer = graphqlHTTP(graphqlSettingsPerReq);

router.all('/graphql', graphqlServer);

app.use(bodyParser());
app.use(convert(cors()));

app.use(router.routes())
    .use(router.allowedMethods());

export default app;