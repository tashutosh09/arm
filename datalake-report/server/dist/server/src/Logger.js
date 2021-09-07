"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("./Config");
const log4js = require("log4js");
const loglayoutPattern = {
    type: 'pattern',
    pattern: '%d{yyyy/MM/dd hh:mm:ss,SSS} [%p] [%c] %x{singleLine}',
    tokens: {
        singleLine: function (logEvent) {
            return JSON.stringify(logEvent.data);
        }
    }
};
log4js.configure({
    appenders: {
        console: {
            type: 'console',
            layout: loglayoutPattern
        },
        file: {
            type: 'file',
            filename: `${Config_1.Config.LOGS}/main.log`,
            layout: loglayoutPattern,
            maxLogSize: 10485760 * 5,
            backups: 3,
            compress: true
        }
    },
    categories: {
        default: {
            appenders: ['console'], level: 'debug'
        },
        DB_RULEMETADATA: {
            appenders: ['file'], level: 'debug'
        },
        SERVICE_GTDDL: {
            appenders: ['file'], level: 'debug'
        },
        CRON_QUERY_SERVICE: {
            appenders: ['file'], level: 'debug'
        },
        SOCKET: {
            appenders: ['file'], level: 'debug'
        },
        DOWNLOAD_QUERY_SERVICE_RESULTS: {
            appenders: ['file'], level: 'debug'
        },
        CRON_CACHED_FILE_EXPIRATION_CHECK: {
            appenders: ['file'], level: 'debug'
        },
    }
});
exports.Loggers = {
    // Console Logs
    consoleLog: log4js.getLogger('console'),
    // Service related logs
    serviceGtddlLog: log4js.getLogger('SERVICE_GTDDL'),
    // DB related logs
    dbRuleMetadataLog: log4js.getLogger('DB_RULEMETADATA'),
    // File related logs
    downloadQueryServiceResultLog: log4js.getLogger('DOWNLOAD_QUERY_SERVICE_RESULTS'),
    // Socket related logs
    socketLog: log4js.getLogger('SOCKET'),
    // Cron Jobs
    cronQueryServiceLog: log4js.getLogger('CRON_QUERY_SERVICE'),
    cronCachedFileExpirationCheck: log4js.getLogger('CRON_CACHED_FILE_EXPIRATION_CHECK')
};
