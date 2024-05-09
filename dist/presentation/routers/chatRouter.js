"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodbChatDataSource_1 = require("../../data/data-sources/mongodb/mongodbChatDataSource");
const chatRepository_1 = require("../../domain/repositories/chatRepository");
const chatUsecase_1 = require("../../domain/use-cases/chatUsecase");
const chatController_1 = require("../controllers/chatController");
const authRouterSetup_1 = require("./authRouterSetup");
const roleBasedAuthMiddleware_1 = require("../../middlewares/roleBasedAuthMiddleware");
const chatRouter = express_1.default.Router();
const chatDataSource = new mongodbChatDataSource_1.ChatModelDataSource();
const chatRepImpl = new chatRepository_1.ChatRepositoryImpl(chatDataSource);
const chatUseImpl = new chatUsecase_1.ChatUseCaseImpl(chatRepImpl);
const chatController = new chatController_1.ChatController(chatUseImpl);
// Define routes
chatRouter.get('/get-conversationId/:userId/:appoinmentId', authRouterSetup_1.authMiddleWare.isAuthenticated.bind(authRouterSetup_1.authMiddleWare), (0, roleBasedAuthMiddleware_1.checkRolesAndPermissions)(['Doctor'], 'READ'), chatController.createConversation.bind(chatController));
chatRouter.get('/chats', authRouterSetup_1.authMiddleWare.isAuthenticated.bind(authRouterSetup_1.authMiddleWare), (0, roleBasedAuthMiddleware_1.checkRolesAndPermissions)(['Doctor', 'User'], 'READ'), chatController.getChatsForUser.bind(chatController));
chatRouter.get('/get-conversation/:convId', authRouterSetup_1.authMiddleWare.isAuthenticated.bind(authRouterSetup_1.authMiddleWare), (0, roleBasedAuthMiddleware_1.checkRolesAndPermissions)(['Doctor', 'User'], 'READ'), chatController.getConversation.bind(chatController));
chatRouter.post('/chats/:chatId/close', chatController.closeChat.bind(chatController));
chatRouter.post('/chats/send', chatController.sendMessage.bind(chatController));
exports.default = chatRouter;
