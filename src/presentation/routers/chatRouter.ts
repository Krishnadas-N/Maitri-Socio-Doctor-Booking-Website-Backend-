import express, { Request, Response, NextFunction } from 'express';
import { ChatModelDataSource } from '../../data/data-sources/mongodb/mongodbChatDataSource';
import { ChatRepositoryImpl } from '../../domain/repositories/chatRepository';
import { ChatUseCaseImpl } from '../../domain/use-cases/chatUsecase';
import { ChatController } from '../controllers/chatController';
import { authMiddleWare } from './authRouterSetup';
import { checkRolesAndPermissions } from '../../middlewares/roleBasedAuthMiddleware';

const chatRouter = express.Router();
const chatDataSource = new ChatModelDataSource();
const chatRepImpl = new ChatRepositoryImpl(chatDataSource);
const chatUseImpl = new ChatUseCaseImpl(chatRepImpl);
const chatController = new ChatController(chatUseImpl);

// Define routes

chatRouter.get('/get-conversationId/:userId/:appoinmentId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Doctor'], 'READ'),chatController.createConversation.bind(chatController));

chatRouter.get('/chats',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Doctor','User'], 'READ'),chatController.getChatsForUser.bind(chatController));

chatRouter.get('/get-conversation/:convId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Doctor','User'], 'READ'),chatController.getConversation.bind(chatController))

chatRouter.post('/chats/:chatId/close', chatController.closeChat.bind(chatController));

chatRouter.post('/chats/send', chatController.sendMessage.bind(chatController));

export default chatRouter;
