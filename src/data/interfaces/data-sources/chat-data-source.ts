import { Conversation, Message } from "../../../domain/entities/Chat";
import {  getChatResponse } from "../../../models/chat-models";

export interface IChatModelDataSource {
    createConverstation(doctorId:string,patientId: string): Promise<string>;
    getChatsForUser(userId: string): Promise<getChatResponse>;
    closeChat(chatId: string, doctorId: string): Promise<void>;
    saveMessage(senderId: string, message: string, conversationId: string, receiverId: string,userType: string): Promise<Message>;
    getConversation(convId:string):Promise<Conversation> ;
    getMessages(convId:string):Promise<Message[]>;
  }