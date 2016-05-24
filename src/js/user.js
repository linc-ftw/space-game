import uuid from 'node-uuid';

import { Password } from './password';
import { encodeJsonWebToken } from './util';

const LOGIN_TOKEN_TTL = 10 * 60 * 1000;

export class User {

    constructor(username, password) {
        this.id = uuid.v4();
        this.username = username;
        this.password = new Password(password);
    }

    getAuthToken() {
        const payload = {
            exp: Math.round(new Date().getTime() / 1000) + LOGIN_TOKEN_TTL,
            userId: this.id
        };
        return encodeJsonWebToken(payload);
    }
}