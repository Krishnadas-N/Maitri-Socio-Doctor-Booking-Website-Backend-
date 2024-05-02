import { Chat, Message } from "../domain/entities/Chat"
import Doctor from "../domain/entities/Doctor"
import { User } from "../domain/entities/User"


export interface getChatResponse{
    chats:Chat[] | [],
    userParticipantDetails: Exclude<User, 'password'> | null;
    doctorParticipantDetails: Exclude<Doctor, 'password'> | null;
}

export interface SaveMessageResponse {
    messageId: string;
    message: string;
    messageType: string;
    senderId: string;
    receiverId: string;
}