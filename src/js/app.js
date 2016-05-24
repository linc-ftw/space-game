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

const handler = handlerFunc => handlerFunc.bind(handlers);
const secureHandler = handlerFunc => function(req, res) {
    handlers.requireAuthenticatedUser(req);
    handlerFunc.call(handlers, req, res);
};

process.on('uncaughtException', err => log.error(err));

app.use(handler(handlers.enableCors));
app.use(compress());
app.use(bodyParser.json());
app.use(cookieParser());

// Unauthenticated endpoints

app.post('/user/register', handler(handlers.userRegister));
app.post('/user/login', handler(handlers.userLogin));

// Authenticated endpoints

app.get('/user', secureHandler(handlers.userInfo));
app.post('/user/logout', secureHandler(handlers.userLogout));

app.get('*', handler(handlers.catchAll));

app.use(handler(handlers.error));

export default app;