import { CustomError } from "../../../../utils/CustomError";
import { SaveMessageResponse, getChatResponse } from "../../../models/chat-models";
import { Conversation, Message } from "../../entities/Chat";
import { ChatRepository } from "../../interfaces/repositories/chat-IRepository";
import { ChatUseCase } from "../../interfaces/use-cases/chat-Service/chat-IUsecase";

export class ChatUseCaseImpl implements ChatUseCase {
    constructor(private repository: ChatRepository) {}

    async getChatsForUser(userId: string): Promise<getChatResponse> {
        if (!userId) {
            throw new CustomError('Missing user ID', 400);
        }
        return await this.repository.getChatsForUser(userId);
    }

    async closeChat(chatId: string, doctorId: string): Promise<void> {
        if (!chatId || !doctorId) {
            throw new CustomError('Missing chat ID or doctor ID', 400);
        }
        await this.repository.closeChat(chatId, doctorId);
    }

    async sendMessage(senderId: string, message: string, conversationId: string, receiverId: string,userType: string): Promise<Message> {
      
        if (!senderId || !message || !conversationId || !receiverId) {
            throw new CustomError('Missing required parameters', 400);
        }
        return await this.repository.saveMessage(senderId, message, conversationId, receiverId,userType);
    }

   async createConverstation(doctorId: string, patientId: string): Promise<string> {
        try{
            if(!doctorId || !patientId){
                throw new CustomError( 'Invalid data provided', 400);
            }
            return this.repository.createConverstation(doctorId, patientId);
        }  catch (error: any) {
            if (error instanceof CustomError) {
              throw error;
            } else {
              throw new CustomError(error.message || "Internal Server", 500);
            }
          }
    }

   async getConversation(convId: string): Promise<Conversation> {
       try{
        if(!convId ){
            throw new CustomError( 'Invalid Conversation id provided', 400);
        }
        return this.repository.getConversation(convId);
       } catch (error: any) {
            if (error instanceof CustomError) {
              throw error;
            } else {
              throw new CustomError(error.message || "Internal Server", 500);
            }
          }
    }

    async getIndividualMessages(convId: string): Promise<Message[]> {
        try{
        if(!convId){
            throw new CustomError( 'Invalid parameter provided', 400);
                }
                return this.repository.getConversationMessages(convId)
            } catch (error: any) {
            if (error instanceof CustomError) {
            throw error;
            } else {
            throw new CustomError(error.message || "Internal Server", 500);
            }
        }
}
}