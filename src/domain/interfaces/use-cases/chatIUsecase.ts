import { SaveMessageResponse, getChatResponse } from "../../../models/chat.model";
import { Conversation, Message } from "../../entities/Chat";

export interface IChatUseCase {
    getIndividualMessages(convId:string):Promise<Message[]>;
    createConverstation(doctorId:string,patientId: string,appoinmentId:string): Promise<{
        convId: string;
        consultationLink: string;
    }>
    getChatsForUser(userId: string): Promise<Conversation[]>;
    getConversation(convId:string):Promise<Conversation>;
    closeChat(chatId: string, doctorId: string): Promise<void>;
    sendMessage(senderId: string, message: string, conversationId: string, receiverId: string,userType: string): Promise<Message>;
    toggleConversationStatus(convId:string,doctorId:string):Promise<Conversation>
}
