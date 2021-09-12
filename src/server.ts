import app from './app';
import { createServer } from 'http';
import { connectDB } from './mongodb';

const server = createServer(app.callback());

(async () => {
    await connectDB();
    console.log(process.env.PORT || 'Mongo connected');
    server.listen(4000, () => {
        console.log('Server running http://localhost:4000');
    });
})();