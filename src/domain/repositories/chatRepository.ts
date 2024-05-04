import {  IChatModelIDataSource } from "../../data/interfaces/data-sources/chatIDataSource";
import { Conversation, Message } from "../entities/Chat";
import { IChatRepository } from "../interfaces/repositoryInterfaces/chatIRepository"; 


export class ChatRepositoryImpl implements IChatRepository {
    constructor(private dataSource: IChatModelIDataSource) {}

    async createConverstation(doctorId: string, patientId: string,appoinmentId:string): Promise<{
        convId: string;
        consultationLink: string;
    }> {
        return this.dataSource.createConverstation(doctorId, patientId,appoinmentId);
    }

    async getChatsForUser(userId: string): Promise<Conversation[]> {
        return await this.dataSource.getChatsForUser(userId);
    }

    async closeChat(chatId: string, doctorId: string): Promise<void> {
        await this.dataSource.closeChat(chatId, doctorId);
    }

    async saveMessage(senderId: string, message: string, conversationId: string, receiverId: string,userType: string): Promise<Message> {
        return await this.dataSource.saveMessage(senderId, message, conversationId, receiverId,userType);
    }

    async getConversation(convId: string): Promise<Conversation> {
        return await this.dataSource.getConversation(convId);
    }

   async getConversationMessages(convId: string): Promise<Message[]> {
        return this.dataSource.getMessages(convId)
    }
}
