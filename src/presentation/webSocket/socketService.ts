import { Server } from 'socket.io';
import { ChatModelDataSource } from '../../data/data-sources/mongodb/mongodbChatDataSource'; 
import { ChatRepositoryImpl } from '../../domain/repositories/chatRepository'; 
import { ChatUseCaseImpl } from '../../domain/use-cases/chatUsecase'; 
import { ChatSocketController } from '../controllers/webSocketControllers/chatSocketController'; 
import { NotificationController } from '../controllers/webSocketControllers/notificationController';
import { NotificationRepository } from '../../domain/repositories/notificationRepository';
import { NotificationDataSource } from '../../data/data-sources/mongodb/mongodbNotificationDataSource';
import { NotificationUsecase } from '../../domain/use-cases/notifyUsecase';

export function initializeSocketConnection(io: Server) {

    const chatDataSource = new ChatModelDataSource();
    const chatRepImpl = new ChatRepositoryImpl(chatDataSource);
    const chatUseImpl = new ChatUseCaseImpl(chatRepImpl);
    const notificationRepository = new NotificationRepository(new NotificationDataSource())
    const notificationUsecase = new NotificationUsecase(notificationRepository)


    const chatNamespace = io.of('/api/chats');
    const notificationNameSpace = io.of('/api/notifications');
    const notificationController = new NotificationController(notificationNameSpace,notificationUsecase);
    const chatSocketController = new ChatSocketController(chatUseImpl, chatNamespace);

    notificationController.handleChatEvents();
    chatSocketController.handleChatEvents()
}
