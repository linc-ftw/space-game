import log from './logging';
import { validate } from './validation';
import { User } from './user';

function success(data) {
    if (typeof data === 'string') {
        return success({ message: data });
    }
    return Object.assign({ ok: true }, data);
}

function failure(data) {
    if (typeof data === 'string') {
        return success({ message: data });
    }
    return Object.assign({ error: true }, data);
}

class Api {

    constructor() {
        this.users = [];
    }

    addUser(username, password) {
        log.debug('api.addUser', username, password);
        let user = new User(username, password);
        this.users.push(user);
        return user;
    }

    getUserByUsername(username) {
        log.debug('api.getUserByUsername', username);
        return this.users
            .filter(user => user.username === username)[0];
    }

    getUserById(id) {
        log.debug('api.getUserById', id);
        return this.users
            .filter(user => user.id === id)[0];
    }

    userRegister(username, password) {
        log.debug('api.userRegister', username, password);

        validate.username(username);
        validate.password(password);

        let existingUser = this.getUserByUsername(username);

        if (existingUser) {
            log.debug('failure');
            return failure(`User ${username} already exists`);
        }

        this.addUser(username, password);

        log.debug('success');
        return success(`User ${username} created`);
    }

    userLogin(username, password) {
        log.debug('api.userLogin', username, password);

        validate.username(username);
        validate.password(password);

        let user = this.getUserByUsername(username);

        if (!user || !user.password.equals(password)) {
            log.debug('failure');
            return [failure(`Login failed`), null];
        }

        log.debug('success');
        return [success(), user];
    }

}

export { Api };