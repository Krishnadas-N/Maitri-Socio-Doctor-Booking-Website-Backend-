import { Conversation, Message } from "../../entities/Chat";

export interface IChatRepository {
    getConversationMessages(convId:string):Promise<Message[]>;
    createConverstation(doctorId:string,patientId: string,appoinmentId:string): Promise<{
        convId: string;
        consultationLink: string;
    }>;
    getChatsForUser(userId: string): Promise<Conversation[]>;
    closeChat(chatId: string, doctorId: string): Promise<void>;
    getConversation(convId:string):Promise<Conversation> 
    saveMessage(senderId: string, message: string, conversationId: string, receiverId: string,userType: string): Promise<Message>;
}