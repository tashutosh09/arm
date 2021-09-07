"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./Logger");
const socketIo = require("socket.io");
// var io = req.app.get('socketio');
// io.emit("message", 'hi!');
// Creates and configures an ExpressJS web server.
class SocketApp {
    constructor(server) {
        this.io = socketIo(server);
        console.log(this.io.sockets.getMaxListeners());
        this.io.sockets.setMaxListeners(0);
        console.log("Socket listeners set to 0");
        this.io.on('connection', (socket) => {
            Logger_1.Loggers.socketLog.info('New client connected with socket ID : ' + socket.id);
            socket.on('disconnect', () => {
                Logger_1.Loggers.socketLog.info('Client disconnected');
            });
        });
    }
}
exports.SocketApp = SocketApp;
