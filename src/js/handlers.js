import log from './logging';

class Handlers {

    constructor(api) {
        this.api = api;
    }

    enableCors(req, res, next) {
        res.set('Access-Control-Allow-Origin', '*');
        next();
    }

    error(err, req, res, next) {
        if (err) {

            log.error(err.stack);

            const output = {
                error: `${err.message}`,
                endpoint: req.path
            };

            res.status(this.statusCodeForError(err));
            res.json(output);

        } else {
            next(err);
        }
    }

    statusCodeForError() {
        log.debug('No specific error type handling defined, defaulting to HTTP 500');
        return 500;
    }

}

export { Handlers };