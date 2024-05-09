"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Websocket = void 0;
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const WEBSOCKET_CORS = {
    origin: "*",
    methods: ["GET", "POST"]
};
class Websocket extends socket_io_1.Server {
    constructor(httpServer) {
        super(httpServer, { cors: WEBSOCKET_CORS });
    }
    static getInstance(httpServer) {
        if (!Websocket.io) {
            Websocket.io = new Websocket(httpServer || (0, http_1.createServer)());
        }
        return Websocket.io;
    }
    initializeHandlers(socketHandlers) {
        socketHandlers.forEach(element => {
            const namespace = Websocket.io.of(element.path);
            namespace.on('connection', (socket) => {
                element.handler.handleConnection(socket);
            });
            if (element.handler.middlewareImplementation) {
                namespace.use((socket, next) => {
                    element.handler.middlewareImplementation(socket, next);
                });
            }
        });
    }
}
exports.Websocket = Websocket;
