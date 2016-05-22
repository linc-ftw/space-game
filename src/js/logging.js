import winston from 'winston';

function getTransports() {
    return [
        new (winston.transports.Console)({
            colorize: true,
            json: false,
            humanReadableUnhandledException: true
        })
    ];
}

const logger = new (winston.Logger)({
    transports: getTransports()
});

export default logger;