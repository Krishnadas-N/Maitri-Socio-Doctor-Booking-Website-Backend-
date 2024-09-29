import { Server } from 'socket.io';
import { ChatModelDataSource } from '../../data/data-sources/mongodb/mongodbChatDataSource'; 
import { ChatRepositoryImpl } from '../../domain/repositories/chatRepository'; 
import { ChatUseCaseImpl } from '../../domain/use-cases/chatUsecase'; 
import { ChatSocketController } from '../controllers/webSocketControllers/socketController'; 
import { NotificationRepository } from '../../domain/repositories/notificationRepository';
import { NotificationDataSource } from '../../data/data-sources/mongodb/mongodbNotificationDataSource';
import { NotificationUsecase } from '../../domain/use-cases/notifyUsecase';

export function initializeSocketConnection(io: Server) {
    const chatDataSource = new ChatModelDataSource();
    const chatRepImpl = new ChatRepositoryImpl(chatDataSource);
    const chatUseImpl = new ChatUseCaseImpl(chatRepImpl);
    const notificationRepository = new NotificationRepository(new NotificationDataSource())
    const notificationUsecase = new NotificationUsecase(notificationRepository)
    const chatSocketController = new ChatSocketController(chatUseImpl, io,notificationUsecase);
    chatSocketController.handleChatEvents()
    chatSocketController.handleNotificationEvents()
}
