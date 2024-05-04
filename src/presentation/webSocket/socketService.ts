import { Server, Socket } from 'socket.io';
import { ChatModelDataSource } from '../../data/data-sources/mongodb/mongodbChatDataSource'; 
import { ChatRepositoryImpl } from '../../domain/repositories/chatRepository'; 
import { ChatUseCaseImpl } from '../../domain/use-cases/chatUsecase'; 
import { ChatSocketController } from '../controllers/webSocketControllers/chatSocketController'; 

export function initializeSocketConnection(io: Server) {

    const chatDataSource = new ChatModelDataSource();
    const chatRepImpl = new ChatRepositoryImpl(chatDataSource);
    const chatUseImpl = new ChatUseCaseImpl(chatRepImpl);

    const chatNamespace = io.of('/chat');
    const chatSocketController = new ChatSocketController(chatUseImpl, chatNamespace);

    chatSocketController.handleChatEvents()
}
