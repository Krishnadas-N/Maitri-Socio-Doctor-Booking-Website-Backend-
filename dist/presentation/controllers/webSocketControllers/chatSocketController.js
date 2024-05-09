"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSocketController = void 0;
const socketAuthentication_1 = __importDefault(require("../../../middlewares/socketAuthentication"));
class ChatSocketController {
    constructor(chatUseCase, chatNamespace) {
        this.chatUseCase = chatUseCase;
        this.chatNamespace = chatNamespace;
        this.name = "";
    }
    handleChatEvents() {
        const connectedUsers = [];
        this.chatNamespace.on("connection", (socket) => {
            this.chatNamespace.use(socketAuthentication_1.default);
            console.log("user connected ");
            socket.on('add user', (userId) => {
                connectedUsers.push({ userId, socketId: socket.id });
                console.log('User added to connectedUsers:', connectedUsers);
            });
            socket.on("getChats", () => __awaiter(this, void 0, void 0, function* () {
                try {
                    console.log('"get chats" event received');
                    const userId = 123; // Assuming user ID is attached to the socket
                    this.chatNamespace.emit("chats", userId);
                }
                catch (error) {
                    console.error("Error retrieving chats:", error);
                }
            }));
            socket.on("close chat", (chatId, doctorId) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.chatUseCase.closeChat(chatId, doctorId);
                    this.chatNamespace.emit("chat closed", chatId);
                }
                catch (error) {
                    console.error("Error closing chat:", error);
                }
            }));
            socket.on("send message", (_a) => __awaiter(this, [_a], void 0, function* ({ senderId, recipientId, conversationId, message, userType, }) {
                var _b, _c;
                try {
                    console.log("socket.data.user", socket.data.user);
                    console.log(senderId, message, conversationId, recipientId, userType);
                    const response = yield this.chatUseCase.sendMessage(senderId, message, conversationId, recipientId, userType);
                    const senderSocketId = (_b = connectedUsers.find(user => user.userId === senderId)) === null || _b === void 0 ? void 0 : _b.socketId;
                    const recipientSocketId = (_c = connectedUsers.find(user => user.userId === recipientId)) === null || _c === void 0 ? void 0 : _c.socketId;
                    console.log("senderSocketId recipientSocketId", senderSocketId, recipientSocketId);
                    if (senderSocketId) {
                        this.chatNamespace.to(senderSocketId).emit("new message", response);
                    }
                    if (recipientSocketId) {
                        this.chatNamespace.to(recipientSocketId).emit("new message", response);
                    }
                    console.log(response);
                }
                catch (error) {
                    console.error("Error sending message:", error);
                }
            }));
            socket.on("getMessages", (conversationId) => __awaiter(this, void 0, void 0, function* () {
                try {
                    // Retrieve messages for the specified conversationId
                    const messages = yield this.chatUseCase.getIndividualMessages(conversationId);
                    console.log("messages", messages);
                    // Emit the messages to the client
                    this.chatNamespace.emit("get-messages", messages);
                }
                catch (error) {
                    console.error("Error retrieving messages:", error);
                }
            }));
            socket.on("typing", (data) => socket.broadcast.emit("typingResponse", data));
            socket.on("joining msg", (username) => {
                this.name = username;
                this.chatNamespace.emit("chat message", `---${this.name} joined the chat---`);
            });
            socket.on("connect_error", (error) => {
                console.log("////////////////////////////////////////////////////////////=====>", error.message);
            });
            socket.on('join-room', (roomId, userId) => {
                socket.join(`private room ${roomId}`);
                socket.to(`private room ${roomId}`).emit('user-connected', userId);
                socket.on('disconnect', () => {
                    socket.to(`private room ${roomId}`).emit('user-disconnected', userId);
                });
            });
            socket.on("disconnect", () => {
                console.log("A user disconnected from the chat namespace");
                const index = connectedUsers.findIndex(user => user.socketId === socket.id);
                if (index !== -1) {
                    connectedUsers.splice(index, 1);
                    console.log('User removed from connectedUsers:', connectedUsers);
                }
            });
        });
    }
}
exports.ChatSocketController = ChatSocketController;
