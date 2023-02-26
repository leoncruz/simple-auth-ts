import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import { AppDataSource } from './data-source';
import { UserRegistrationController } from './controllers/UserRegistrationController';
import { UserSessionController } from './controllers/UserSessionController';
import { UserConfirmationController } from './controllers/UserConfirmationController';
import { RequireAuthMiddleware } from './accounts/RequireAuthMiddleware';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/users/signup', UserRegistrationController.create);

app.post('/users/signin', UserSessionController.create);

app.patch('/users/confirm', UserConfirmationController.update);

app.post('/users/confirm', UserConfirmationController.create);

const privateRoutes = express.Router();

privateRoutes.get('/posts', (_req, resp) => resp.json({ data: [] }));

app.use(RequireAuthMiddleware.init, privateRoutes);

AppDataSource.initialize().then(() => {
  app.listen(3333, () => {
    console.log(`server listen on port ${3333}`);
  });
});
