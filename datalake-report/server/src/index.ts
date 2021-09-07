import { Loggers } from './Logger';

import { FileRemoveRunner } from './runner/FileRemoveRunner';
import { Config } from './Config';
import { QueryRunner } from './runner/QueryRunner';
import * as http from 'http';
import * as debug from 'debug';

import RestApp from './RestApp';
import { SocketApp } from './SocketApp';
import { normalizePort } from './Helper';

debug('ts-express:server');

const port = normalizePort(Config.PORT);

RestApp.set('port', port);

const server = http.createServer(RestApp);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

let io = new SocketApp(server).io;
RestApp.set("socketio", io);
new QueryRunner(io);
new FileRemoveRunner();

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            Loggers.consoleLog.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            Loggers.consoleLog.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening(): void {
    let addr = server.address();
    let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    Loggers.consoleLog.debug(`Listening on ${bind}`);
}