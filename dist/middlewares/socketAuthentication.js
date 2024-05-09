"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = require("../utils/customError"); // Assuming CustomError is defined elsewhere
const passport_1 = __importDefault(require("passport"));
// eslint-disable-next-line @typescript-eslint/ban-types
const authenticateSocket = (socket, next) => {
    console.log("Socket authentication called ", socket);
    passport_1.default.authenticate('jwt', (err, payload, info) => {
        if (err)
            return next(err);
        if (!payload) {
            return next(new customError_1.CustomError('Unauthorized', 401));
        }
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            return next(new customError_1.CustomError('Token has expired', 401));
        }
        console.log("Socket Authenticated 😊😊😊😊", payload);
        socket.data.user = payload; // Attach user data to socket
        next();
    })(socket.request, {}, next);
};
exports.default = authenticateSocket;
