import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (_req, resp) => {
  resp.send({ body: 'hello world' });
});

app.listen(3333, () => {
  console.log(`server listen on port ${3333}`);
});
