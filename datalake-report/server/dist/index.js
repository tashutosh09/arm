"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./Logger");
const FileRemoveRunner_1 = require("./runner/FileRemoveRunner");
const Config_1 = require("./Config");
const QueryRunner_1 = require("./runner/QueryRunner");
const http = require("http");
const debug = require("debug");
const RestApp_1 = require("./RestApp");
const SocketApp_1 = require("./SocketApp");
const Helper_1 = require("./Helper");
debug('ts-express:server');
const port = Helper_1.normalizePort(Config_1.Config.PORT);
RestApp_1.default.set('port', port);
const server = http.createServer(RestApp_1.default);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
let io = new SocketApp_1.SocketApp(server).io;
RestApp_1.default.set("socketio", io);
new QueryRunner_1.QueryRunner(io);
new FileRemoveRunner_1.FileRemoveRunner();
function onError(error) {
    if (error.syscall !== 'listen')
        throw error;
    let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            Logger_1.Loggers.consoleLog.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            Logger_1.Loggers.consoleLog.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    let addr = server.address();
    let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    Logger_1.Loggers.consoleLog.debug(`Listening on ${bind}`);
}
