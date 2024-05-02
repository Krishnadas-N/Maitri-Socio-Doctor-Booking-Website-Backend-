import { SaveMessageResponse, getChatResponse } from "../../../../models/chat-models";
import { Conversation, Message } from "../../../entities/Chat";

export interface ChatUseCase {
    getIndividualMessages(convId:string):Promise<Message[]>;
    createConverstation(doctorId:string,patientId: string): Promise<string>
    getChatsForUser(userId: string): Promise<getChatResponse>;
    getConversation(convId:string):Promise<Conversation>;
    closeChat(chatId: string, doctorId: string): Promise<void>;
    sendMessage(senderId: string, message: string, conversationId: string, receiverId: string,userType: string): Promise<Message>;
}
