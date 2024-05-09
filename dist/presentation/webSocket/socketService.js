"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocketConnection = void 0;
const mongodbChatDataSource_1 = require("../../data/data-sources/mongodb/mongodbChatDataSource");
const chatRepository_1 = require("../../domain/repositories/chatRepository");
const chatUsecase_1 = require("../../domain/use-cases/chatUsecase");
const chatSocketController_1 = require("../controllers/webSocketControllers/chatSocketController");
function initializeSocketConnection(io) {
    const chatDataSource = new mongodbChatDataSource_1.ChatModelDataSource();
    const chatRepImpl = new chatRepository_1.ChatRepositoryImpl(chatDataSource);
    const chatUseImpl = new chatUsecase_1.ChatUseCaseImpl(chatRepImpl);
    const chatNamespace = io.of('/chat');
    const chatSocketController = new chatSocketController_1.ChatSocketController(chatUseImpl, chatNamespace);
    chatSocketController.handleChatEvents();
}
exports.initializeSocketConnection = initializeSocketConnection;
