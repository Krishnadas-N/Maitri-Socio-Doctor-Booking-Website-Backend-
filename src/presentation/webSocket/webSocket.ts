import { Server, Socket } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';

const WEBSOCKET_CORS = {
    origin: "*",
    methods: ["GET", "POST"]
};

export class Websocket extends Server {
    private static io: Websocket;

    private constructor(httpServer: HttpServer) {
        super(httpServer, { cors: WEBSOCKET_CORS });
    }

    public static getInstance(httpServer?: HttpServer): Websocket {
        if (!Websocket.io) {
            Websocket.io = new Websocket(httpServer || createServer());
        }
        return Websocket.io;
    }

    
}
