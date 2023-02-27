import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';

import { AppDataSource } from './data-source';
import { UserRegistrationController } from './controllers/UserRegistrationController';
import { UserSessionController } from './controllers/UserSessionController';
import { UserConfirmationController } from './controllers/UserConfirmationController';
import { RequireAuthMiddleware } from './accounts/RequireAuthMiddleware';
import { PostController } from './controllers/PostController';
import { UserResetPasswordController } from './controllers/UserResetPasswordController';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/users/signup', UserRegistrationController.create);

app.post('/users/signin', UserSessionController.create);

app.post('/users/refresh', UserSessionController.refresh);

app.patch('/users/confirm', UserConfirmationController.update);

app.post('/users/confirm', UserConfirmationController.create);

app.post('/users/reset_password', UserResetPasswordController.create);

app.post(
  '/users/reset_password/validate',
  UserResetPasswordController.validate
);

app.patch('/users/reset_password', UserResetPasswordController.update);

const privateRoutes = express.Router();

privateRoutes.get('/posts', PostController.index);

app.use(RequireAuthMiddleware.init, privateRoutes);

AppDataSource.initialize().then(() => {
  app.listen(3333, () => {
    console.log(`server listen on port ${3333}`);
  });
});
