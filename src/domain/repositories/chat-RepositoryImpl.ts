import {  IChatModelDataSource } from "../../data/interfaces/data-sources/chat-data-source";
import { SaveMessageResponse, getChatResponse } from "../../models/chat-models";
import { Conversation } from "../entities/Chat";
import { ChatRepository } from "../interfaces/repositories/chat-IRepository";


export class ChatRepositoryImpl implements ChatRepository {
    constructor(private dataSource: IChatModelDataSource) {}

    async createConverstation(doctorId: string, patientId: string): Promise<string> {
        return this.dataSource.createConverstation(doctorId, patientId);
    }

    async getChatsForUser(userId: string): Promise<getChatResponse> {
        return await this.dataSource.getChatsForUser(userId);
    }

    async closeChat(chatId: string, doctorId: string): Promise<void> {
        await this.dataSource.closeChat(chatId, doctorId);
    }

    async saveMessage(senderId: string, message: string, conversationId: string, receiverId: string): Promise<SaveMessageResponse> {
        return await this.dataSource.saveMessage(senderId, message, conversationId, receiverId);
    }

    async getConversation(convId: string): Promise<Conversation> {
        return await this.dataSource.getConversation(convId);
    }
}