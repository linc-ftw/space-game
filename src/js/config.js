import nconf from 'nconf';
import log from './logging';

log.info('Initialising config sources');
nconf.argv().env().file('./config.json');

function booleanStringConverter(value) {
    if (typeof value !== 'string') { return value; }
    if (/^true$/i.test(value)) { return true; }
    if (/^false$/i.test(value)) { return false; }
    return value;
}

const NOTHING = {};

const config = {
    get: function(key, defaultValue = NOTHING, valueConverter) {
        const value = nconf.get(key);
        if (value !== undefined) {
            if (valueConverter !== undefined) {
                return valueConverter(value);
            }
            return booleanStringConverter(value);
        }
        if (defaultValue !== NOTHING) {
            return defaultValue;
        }
        throw new `Configuration value for key "${key}" not found`;
    }
};

export default config;