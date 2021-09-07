import { Loggers } from './Logger';
import * as socketIo from "socket.io";

// var io = req.app.get('socketio');
// io.emit("message", 'hi!');

// Creates and configures an ExpressJS web server.
export class SocketApp {
    public io: SocketIO.Server;

    constructor(server: any) {
        this.io = socketIo(server);
        //Start Subrata 26122020
        /*this.io = socketIo(server, {
            serveClient: false,
            // below are engine.IO options
            origins: '*:*',
            transports: ['polling'], 
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false
          });*/
        //End Subrata 26122020
        console.log("Max Listeners "+this.io.sockets.getMaxListeners());
        this.io.sockets.setMaxListeners(0);
        console.log("Socket listeners set to 0");

        this.io.on('connection', (socket: any) => {
            Loggers.socketLog.info('New client connected with socket ID : ' + socket.id);

            socket.on('disconnect', () => {
                Loggers.socketLog.info('Client disconnected');
            });
        });
    }
}
