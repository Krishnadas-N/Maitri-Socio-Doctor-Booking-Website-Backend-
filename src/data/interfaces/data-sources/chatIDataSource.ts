import { Conversation, Message } from "../../../domain/entities/Chat";

export interface IChatModelIDataSource {
    createConverstation(doctorId:string,patientId: string,appoinmentId:string): Promise<{
      convId: string;
      consultationLink: string;
     }>;
    getChatsForUser(userId: string): Promise<Conversation[]>;
    closeChat(chatId: string, doctorId: string): Promise<void>;
    saveMessage(senderId: string, message: string, conversationId: string, receiverId: string,userType: string): Promise<Message>;
    getConversation(convId:string):Promise<Conversation> ;
    getMessages(convId:string):Promise<Message[]>;
  }