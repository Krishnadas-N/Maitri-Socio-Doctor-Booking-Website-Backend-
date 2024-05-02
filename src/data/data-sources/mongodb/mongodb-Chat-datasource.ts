import mongoose from "mongoose";
import {  Conversation, Message } from "../../../domain/entities/Chat";
import { CustomError } from "../../../../utils/CustomError";
import { UserModel } from "./models/user-model";
import DoctorModel from "./models/Doctor-model";
import { SaveMessageResponse, getChatResponse } from "../../../models/chat-models";
import { User } from "../../../domain/entities/User";
import Doctor from "../../../domain/entities/Doctor";
import { Conversation as ConversationModel } from "./models/Conversational-model";
import { MongoDbUserDataSource } from "./mongodb-user-dataSource";
import { IChatModelDataSource } from "../../interfaces/data-sources/chat-data-source";
import { Messages as MessageModel } from "./models/Message-Model";



export class ChatModelDataSource implements IChatModelDataSource {
  constructor() {}

  async createConverstation(
    doctorId: string,
    patientId: string
  ): Promise<string> {
    try {
      console.log(
        "Log From Create COnverstaion  Data Source",
        doctorId,
        patientId
      );
      if (!MongoDbUserDataSource.isUserExists(patientId)) {
        throw new CustomError("USER_NOT_FOUND", 404);
      }
      const existingChat = await ConversationModel.findOne({
        isGroupChat: false,
        $and: [
          { "members.memberType": "Doctor", "members.member": doctorId },
          { "members.memberType": "User", "members.member": patientId },
        ],
      });
      if (existingChat) {
        return existingChat._id.toString(); // Return existing conversation ID
      } else {
        const newConversation = new ConversationModel({
          members: [
            { member: doctorId, memberType: "Doctor" },
            { member: patientId, memberType: "User" },
          ],
        });

        await newConversation.save();
        return newConversation._id.toString();
      }
    } catch (error: any) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw new CustomError(error.message || "Internal Server", 500);
      }
    }
  }

  async getChatsForUser(userId: string): Promise<getChatResponse> {
    throw new Error("Method not implemented")
    // try {
    //   console.log("A call from come in db chatsfor user");
    //   if (!mongoose.Types.ObjectId.isValid(userId)) {
    //     throw new CustomError("Invalid user id", 400);
    //   }
    //   const chats = await ChatModel.find({
    //     "participants.participant": userId,
    //   });
    //   if (chats.length === 0) {
    //     return {
    //       chats: [],
    //       userParticipantDetails: null,
    //       doctorParticipantDetails: null,
    //     };
    //   }

    //   let userParticipantDetails!: Exclude<User, "password">;
    //   let doctorParticipantDetails!: Exclude<Doctor, "password">;
    //   for (let chat of chats) {
    //     for (let participant of chat.participants) {
    //       if (participant.participantType === "User") {
    //         userParticipantDetails = await UserModel.findById(
    //           participant.participant
    //         ).select("-password");
    //         if (!userParticipantDetails) {
    //           throw new CustomError("User participant details not found", 404);
    //         }
    //       } else if (participant.participantType === "Doctor") {
    //         doctorParticipantDetails = await DoctorModel.findById(
    //           participant.participant
    //         ).select("-password");
    //         if (!doctorParticipantDetails) {
    //           throw new CustomError(
    //             "Doctor participant details not found",
    //             404
    //           );
    //         }
    //       }
    //     }
    //   }

    //   return {
    //     chats,
    //     userParticipantDetails,
    //     doctorParticipantDetails,
    //   };
    // } catch (error: any) {
    //   if (error instanceof CustomError) {
    //     throw error;
    //   } else {
    //     throw new CustomError(error.message || "Internal Server", 500);
    //   }
    // }
  }

  async closeChat(chatId: string, doctorId: string): Promise<void> {
    throw new Error("Method not implemented")
    // try {
    //   if (!mongoose.Types.ObjectId.isValid(chatId)) {
    //     throw new CustomError("Invalid chatId ", 400);
    //   }
    //   const chat = await ChatModel.findById(chatId);
    //   if (!chat) {
    //     throw new CustomError("This chat does not exist.", 404);
    //   }

    //   const doctorParticipant = chat.participants.find(
    //     (participant) =>
    //       participant.participantType === "Doctor" &&
    //       participant.participant.toString() === doctorId
    //   );

    //   if (!doctorParticipant) {
    //     throw new CustomError("You are not the owner of this chat.", 403);
    //   }
    //   chat.isOpen = false;
    //   await chat.save();
    // } catch (error: any) {
    //   if (error instanceof CustomError) {
    //     throw error;
    //   } else {
    //     throw new CustomError(error.message || "Internal Server", 500);
    //   }
    // }
  }

  async saveMessage( senderId: string,message: string,conversationId: string, receiverId: string,
                      userType: string
  ): Promise<Message> {
    try {
      if (!senderId || !message || !conversationId || !receiverId) {
        throw new CustomError("Missing required parameters", 400);
      }

      const senderModel = userType === 'doctor' ? 'Doctor' : userType === 'user' ? 'User' : null;
      if (!senderModel) {
        throw new CustomError(`Invalid user type ${userType}`, 400);
      }

      const conversation = await ConversationModel.findById(conversationId);
      if (!conversation) {
        throw new Error("Conversation not found");
      }

      const newMessage = new MessageModel({
        conversationId: conversationId,
        senderId: senderId,
        senderModel: senderModel,
        content: { text: message },
        messageType: "text",
      });

      return await newMessage.save();
    } catch (error: any) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw new CustomError(error.message || "Internal Server", 500);
      }
    }
  }

  async getConversation(convId: string): Promise<Conversation> {
    try {
      if (!mongoose.Types.ObjectId.isValid(convId)) {
        throw new CustomError("Invalid conversation id.", 400);
      }
      const conv = await ConversationModel.findById(convId).populate(
        "members.member"
      );

      if (!conv) {
        throw new Error("Conversation not found.");
      }
      console.log(conv);
      return conv as unknown as Conversation;
    } catch (error: any) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw new CustomError(error.message || "Internal Server", 500);
      }
    }
  }


  async getMessages(convId: string): Promise<Message[]> {
    try {
      const messages = await MessageModel.find({ conversationId: convId });
      
      messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      return messages; 
    } catch (error: any) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw new CustomError(error.message || "Internal Server Error", 500);
      }
    }  
  }
  
}
