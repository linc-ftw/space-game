import express from 'express';
import compress from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { Handlers } from './handlers';
import { Api } from './api';

import log from './logging';

const app = express();
const api = new Api();
const handlers = new Handlers(api);

process.on('uncaughtException', err => log.error(err));

function bindHandler(fn) { return fn.bind(handlers); }

app.use(handlers.enableCors);
app.use(compress());
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/user', bindHandler(handlers.requireAuthenticatedUser), bindHandler(handlers.userInfo));
app.post('/user/register', bindHandler(handlers.userRegister));
app.post('/user/login', bindHandler(handlers.userLogin));

app.get('*', bindHandler(handlers.catchAll));

app.use(bindHandler(handlers.error));

export default app;