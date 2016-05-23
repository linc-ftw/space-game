import express from 'express';
import compress from 'compression';

import { Handlers } from './handlers';
import { Api } from './api';

import log from './logging';

const app = express();
const api = new Api();
const handlers = new Handlers(api);

process.on('uncaughtException', err => log.error(err));

app.use(handlers.enableCors);
app.use(compress());

app.get('*', function(req, res) {
    res.header('Content-Type', 'application/json');
    res.status(404).send({
        error: 'Not Found',
        endpoint: req.originalUrl
    });
});

app.use(handlers.error);

export default app;