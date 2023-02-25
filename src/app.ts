import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import { AppDataSource } from './data-source';
import { UserRegistrationController } from './controllers/UserRegistrationController';
import { UserSessionController } from './controllers/UserSessionController';
import { UserConfirmationController } from './controllers/UserConfirmationController';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (_req, resp) => {
  resp.send({ body: 'hello world' });
});

app.post('/users/signup', UserRegistrationController.create);

app.post('/users/signin', UserSessionController.create);

app.patch('/users/confirm', UserConfirmationController.update);

app.post('/users/confirm', UserConfirmationController.create);

AppDataSource.initialize().then(() => {
  app.listen(3333, () => {
    console.log(`server listen on port ${3333}`);
  });
});
