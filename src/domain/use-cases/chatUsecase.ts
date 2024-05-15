import { CustomError } from "../../utils/customError";
import { Conversation, Message } from "../entities/Chat";
import { IChatRepository } from "../interfaces/repositoryInterfaces/chatIRepository"; 
import { IChatUseCase } from "../interfaces/use-cases/chatIUsecase";

export class ChatUseCaseImpl implements IChatUseCase {
    constructor(private repository: IChatRepository) {}

    async getChatsForUser(userId: string): Promise<Conversation[]> {
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

   async createConverstation(doctorId: string, patientId: string,appoinmentId:string): Promise<{
    convId: string;
    consultationLink: string;
    }> {
        try{
            if(!doctorId || !patientId){
                throw new CustomError( 'Invalid data provided', 400);
            }
            return this.repository.createConverstation(doctorId, patientId,appoinmentId);
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
    }

   async getConversation(convId: string): Promise<Conversation> {
       try{
        if(!convId ){
            throw new CustomError( 'Invalid Conversation id provided', 400);
        }
        return this.repository.getConversation(convId);
       }catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
    }

    async getIndividualMessages(convId: string): Promise<Message[]> {
        try{
        if(!convId){
            throw new CustomError( 'Invalid parameter provided', 400);
                }
                return this.repository.getConversationMessages(convId)
            } catch (error:unknown) {
                if (error instanceof CustomError) {
                    throw error;
                } else {
                    const castedError = error as Error
              console.error('Unexpected error:', error);
              throw new CustomError(castedError.message || 'Internal server error',500);
                }
            }
}

toggleConversationStatus(convId: string, doctorId: string): Promise<Conversation> {
    try{
        if(!convId ){
            throw new CustomError( 'Invalid Conversation id provided', 400);
        }
        return this.repository.toggleConversation(convId,doctorId);
       }catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        } 
}
}