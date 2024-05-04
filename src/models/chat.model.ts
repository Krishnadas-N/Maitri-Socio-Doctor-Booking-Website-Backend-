import {  Conversation, Message } from "../domain/entities/Chat"


export interface getChatResponse{
    chats:Conversation[] | [],
}

export interface SaveMessageResponse {
    messageId: string;
    message: string;
    messageType: string;
    senderId: string;
    receiverId: string;
}