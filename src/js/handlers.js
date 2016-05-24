import log from './logging';
import { NotAuthenticatedError } from './errors';

const COOKIE_USER_SESSION_ID = 'UserSessionId';

class Handlers {

    constructor(api) {
        this.api = api;
    }

    enableCors(req, res, next) {
        res.set('Access-Control-Allow-Origin', '*');
        next();
    }

    userInfo(req, res) {
        let user = this.getAuthenticatedUser(req);
        res.json(user);
    }

    userRegister(req, res) {
        let result = this.api.userRegister(req.query.username);
        res.json(result);
    }

    userLogin(req, res) {
        let result = this.api.userLogin(req.query.username);

        if (result.ok) {
            res.cookie(COOKIE_USER_SESSION_ID, result.sessionId);
        }

        res.json(result);
    }

    userLogout(req, res) {
        let user = this.getAuthenticatedUser(req);
        let result = this.api.userLogout(user);
        res.json(result);
    }

    getAuthenticatedUser(req) {
        const sessionId = req.cookies[COOKIE_USER_SESSION_ID];
        if (!sessionId) { return; }
        return this.api.getUserBySessionId(sessionId);
    }

    requireAuthenticatedUser(req) {
        let user = this.getAuthenticatedUser(req);
        if (!user) {
            throw new NotAuthenticatedError('Authenticated user required');
        }
    }

    catchAll(req, res) {
        res.header('Content-Type', 'application/json');
        res.status(404).json({
            error: 'Not Found',
            endpoint: req.originalUrl
        });
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

    statusCodeForError(error) {

        if (error instanceof NotAuthenticatedError) {
            return 401;
        }

        log.debug('No handling defined for error, defaulting to HTTP 500');
        return 500;
    }

}

export { Handlers };