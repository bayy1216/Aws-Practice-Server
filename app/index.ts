import dotenv from 'dotenv';
import * as redis from 'redis';
import { createApp } from './app';

dotenv.config();

const { PORT, REDIS_URL } = process.env;

if(!PORT || !REDIS_URL) {
  throw new Error('PORT and REDIS_URL are required');
}

const startServer = async () => {
  console.log('Trying to start server'); 
  const client = redis.createClient({
    url: REDIS_URL
  });
  await client.connect();

  const app = createApp(client);
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return server;
};

const server = startServer();


const gracefulShutdown = async () => {
  const _server = await server;
  _server.close(() => {
    console.log('Server gracefulShutdown!');
    process.exit(1);
  });
};

process.on("SIGTERM", gracefulShutdown);

process.on("SIGINT", gracefulShutdown);
