import crypto from 'crypto';

import { createSecret } from './util';

function hashPassword(text, salt) {
    return crypto.createHmac('sha256', salt)
        .update(text)
        .digest('base64');
}

export class Password {

    constructor(passwordText) {
        this.salt = createSecret();
        this.hash = hashPassword(passwordText, this.salt);
    }

    equals(passwordText) {
        return this.hash === hashPassword(passwordText, this.salt);
    }
}