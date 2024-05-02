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

    public initializeHandlers(socketHandlers: Array<{ path: string, handler: { handleConnection: (socket: Socket) => void, middlewareImplementation?: (socket: Socket, next: (err?: any) => void) => void } }>) {
        socketHandlers.forEach(element => {
            const namespace = Websocket.io.of(element.path);
            namespace.on('connection', (socket: Socket) => {
                element.handler.handleConnection(socket);
            });

            if (element.handler.middlewareImplementation) {
                namespace.use((socket: Socket, next: (err?: any) => void) => {
                    element.handler.middlewareImplementation!(socket, next);
                });
            }
        });
    }
}
