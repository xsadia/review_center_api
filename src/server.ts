import app from './app';
import { createServer } from 'http';
import { connectDB } from './mongodb';

const server = createServer(app.callback());

(async () => {
    await connectDB();
    console.log('Mongo connected');
    server.listen(process.env.PORT, () => {
        console.log(`Server running http://localhost:${process.env.PORT}/graphql`);
    });
})();