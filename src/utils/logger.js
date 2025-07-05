const fs = require('fs');
const path = require('path');

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};

const logLevel = 'debug';

const logDir = path.join(__dirname, '../../logs');
if(!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, 'app.log');

const logger = {
    log(level, message) {
        if(levels[level] <= levels[logLevel]) {
            const timestamp = new Date().toISOString();
            const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}\n`;

            console.log(logMessage);

            fs.appendFileSync(logFile, logMessage, 'utf8');
        }
    },
    error(message) {
        this.log('error', message);
    },
    warn(message) {
        this.log('warn', message);
    },
    info(message) {
        this.log('info', message);
    },
    debug(message) {
        this.log('debug', message);
    },
};

module.exports = logger;

