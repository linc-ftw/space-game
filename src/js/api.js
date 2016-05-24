import uuid from 'node-uuid';

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

    addUser(username) {
        let user = new User(username);
        this.users.push(user);
        return user;
    }

    getUserByUsername(username) {
        return this.users
            .filter(user => user.username === username)[0];
    }

    getUserBySessionId(sessionId) {
        return this.users
            .filter(user => user.sessionId === sessionId)[0];
    }

    userRegister(username) {
        validate.username(username);

        let existingUser = this.getUserByUsername(username);

        if (existingUser) {
            return failure(`User ${username} already exists`);
        }

        this.addUser(username);
        return success(`User ${username} created`);
    }

    createUserSessionId(user) {
        let sessionId = uuid.v4();
        user.setSessionId(sessionId);
        return sessionId;
    }

    userLogin(username) {
        validate.username(username);

        let user = this.getUserByUsername(username);

        if (!user) {
            return failure(`User ${username} not found`);
        }

        let sessionId = this.createUserSessionId(user);

        return success({
            username: user.username,
            sessionId: sessionId
        });
    }

    userLogout(user) {
        user.logout();
        return success(`User ${user.username} logged out`);
    }

}

export { Api };