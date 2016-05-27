import { validate } from './validation';

class HttpError extends Error {
    constructor(message, statusCode) {
        super(message);
        validate.mustBeDefined(statusCode);
        this.statusCode = statusCode;
        this.isHttpError = true;
    }
}

export class NotAuthenticatedError extends HttpError {
    constructor(message) {
        super(message, 401);
    }
}

export class ValidationError extends HttpError {
    constructor(message) {
        super(message, 500);
    }
}


export class ArgumentError extends HttpError {
    constructor(message) {
        super(message, 500);
    }
}
