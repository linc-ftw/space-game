import uuid from 'node-uuid';

const NO_SESSION_ID = {};

export class User {
    constructor(username) {
        this.id = uuid.v4();
        this.username = username;
        this.sessionId = NO_SESSION_ID;
    }

    setSessionId(sessionId) {
        this.sessionId = sessionId;
    }

    logout() {
        this.sessionId = NO_SESSION_ID;
    }
}