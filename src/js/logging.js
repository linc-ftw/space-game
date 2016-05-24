import winston from 'winston';

function getTransports() {
    return [
        new (winston.transports.Console)({
            colorize: true,
            json: false,
            humanReadableUnhandledException: true,
            level: process.env.DEBUG ? 'debug' : 'info'
        })
    ];
}

const logger = new (winston.Logger)({
    transports: getTransports()
});

export default logger;