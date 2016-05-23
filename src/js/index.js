import http from 'http';
// import https from 'https';

import config from './config';
import app from './app';
import log from './logging';

const port = config.get('serverPort');
log.info(`Starting space-game server on port ${port}`);

let server = undefined;
if (config.get('useHttps')) {

    throw 'Someone create some certificates if you want to do this';

    // const creds = {
    //     key: null,
    //     cert: null,
    // };
    // server = https.createServer(creds, app);
    // log.info('Starting HTTPS server');

} else {

    server = http.createServer(app);
    log.info('Starting HTTP server');

}

server.listen(port, function() {
    log.debug(`Successfully started space-game server, listening on port ${port}`);
});