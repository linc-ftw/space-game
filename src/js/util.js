import crypto from 'crypto';
import jwt from 'jwt-simple';

export function createSecret(size = 256) {
    return crypto.randomBytes(size).toString('base64');
}

const JWT_SECRET = createSecret();

export function encodeJsonWebToken(payload) {
    return jwt.encode(payload, JWT_SECRET);
}

export function decodeJsonWebToken(token) {
    try {
        return jwt.decode(token, JWT_SECRET);
    } catch (e) {
        return null;
    }
}
