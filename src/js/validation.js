import { ValidationError, ArgumentError } from './errors';

function validate(value, validator, message, throwError = true) {

    let isValid = false;

    if (typeof validator === 'function') {
        try {
            isValid = validator(value);
        } catch (e) {
            isValid = false;
        }
    } else if (validator instanceof RegExp) {
        isValid = value && validator.test(value);
    } else {
        throw new ArgumentError('validator must be function or RegExp');
    }

    if (!isValid && throwError) {
        throw new ValidationError(message || `Validation failed for value "${value}"`);
    }

    return isValid;
}

export function validateUsername(username, throwError = true) {
    return validate(username, /\w{3,}/, 'Username must be at least 3 characters', throwError);
}
validate.username = validateUsername;

export function validatePassword(password, throwError = true) {
    return validate(password, /\w{3,}/, 'Password must be at least 3 characters', throwError);
}
validate.password = validatePassword;

export function mustBeDefined(value, throwError = true) {
    return validate(value, value => typeof value !== 'undefined', 'Value must be defined', throwError);
}
validate.mustBeDefined = mustBeDefined;

export { validate };