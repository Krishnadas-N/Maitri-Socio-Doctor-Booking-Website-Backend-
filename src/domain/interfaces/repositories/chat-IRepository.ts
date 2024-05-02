import { SaveMessageResponse, getChatResponse } from "../../../models/chat-models";
import { Conversation } from "../../entities/Chat";

export interface ChatRepository {
    createConverstation(doctorId:string,patientId: string): Promise<string>;
    getChatsForUser(userId: string): Promise<getChatResponse>;
    closeChat(chatId: string, doctorId: string): Promise<void>;
    getConversation(convId:string):Promise<Conversation> 
    saveMessage(senderId: string, message: string, conversationId: string, receiverId: string): Promise<SaveMessageResponse>;
}