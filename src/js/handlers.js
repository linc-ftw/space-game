import log from './logging';
import { NotAuthenticatedError } from './errors';
import { decodeJsonWebToken } from './util';

const AUTH_TOKEN_HEADER_NAME = 'Authentication-Token';

class Handlers {

    constructor(api) {
        this.api = api;
    }

    enableCors(req, res, next) {
        res.set('Access-Control-Allow-Origin', '*');
        next();
    }

    setAuthenticatedUser(req, res, user) {
        log.debug('handlers.setAuthenticatedUser', user && user.id || undefined);

        req.authenticatedUser = user;
        if (user) {
            log.debug('Add header', AUTH_TOKEN_HEADER_NAME);
            res.set(AUTH_TOKEN_HEADER_NAME, user.getAuthToken());
        } else if (res) {
            log.debug('Remove header', AUTH_TOKEN_HEADER_NAME);
            res.removeHeader(AUTH_TOKEN_HEADER_NAME);
        }
    }

    getAuthenticatedUser(req, res) {
        log.debug('handlers.getAuthenticatedUser');

        let authToken = req.get(AUTH_TOKEN_HEADER_NAME);
        if (authToken) {

            let decodedToken = decodeJsonWebToken(authToken);
            if (decodedToken) {

                let user = this.api.getUserById(decodedToken.userId);
                this.setAuthenticatedUser(req, res, user);

                return user;
            }
        }

        return null;
    }

    userInfo(req, res) {
        log.debug('handlers.userInfo');

        let user = this.getAuthenticatedUser(req, res);

        res.json({
            id: user.id,
            username: user.username
        });
    }

    userRegister(req, res) {
        log.debug('handlers.userRegister');

        let result = this.api.userRegister(req.query.username, req.query.password);
        res.json(result);
    }

    userLogin(req, res) {
        log.debug('handlers.userLogin');

        let [result, user] = this.api.userLogin(req.query.username, req.query.password);

        if (result.ok && user) {
            this.setAuthenticatedUser(req, res, user);
        }

        res.json(result);
    }

    requireAuthenticatedUser(req, res) {
        log.debug('handlers.requireAuthenticatedUser');

        let user = this.getAuthenticatedUser(req, res);
        if (!user) {
            throw new NotAuthenticatedError('Authenticated user required');
        }
    }

    catchAll(req, res) {
        log.debug('handlers.catchAll');

        res.header('Content-Type', 'application/json');
        res.status(404).json({
            error: 'Not Found',
            endpoint: req.originalUrl
        });
    }

    error(err, req, res, next) {
        log.debug('handlers.error');

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