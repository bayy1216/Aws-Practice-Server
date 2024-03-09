import express from 'express';
import { RedisClientType } from 'redis';
import { request } from 'http';

export const LIST_KEY = 'messages';

export type RedisClient = RedisClientType<any, any, any>;

export const createApp = (client : RedisClient) => {

  const app = express();

  app.use(express.json());
  
  app.get('/', (request, response) => {
    response.status(200).send('Hello World From Express, deployed by github actions!');
  });

  app.post('/messages', async (request, response) => {
    const { message } = request.body;
    await client.lPush(LIST_KEY, message);
    response.status(200).send('Message sent');
  });
  
  app.get('/messages', async (request, response) => {
    const messages = await client.lRange(LIST_KEY, 0, -1);
    response.status(200).send(messages);
  });

  
  return app;
}