import mongoose from "mongoose";
import {  Conversation, Message } from "../../../domain/entities/Chat";
import { CustomError } from "../../../utils/customError"; 
import { conversationModel } from "./models/conversationalModel";
import { MongoDbUserDataSource } from "./mongodbUserDataSource";
import { IChatModelIDataSource } from "../../interfaces/data-sources/chatIDataSource";
import { messageModel } from "./models/messageModel";
import { ConsultaionModel } from "./mongodbConsultationDataSource";



export class ChatModelDataSource implements IChatModelIDataSource {
  constructor() {}

  async createConverstation(
    doctorId: string,
    patientId: string,
    appoinmentId:string
  ): Promise<{
    convId: string;
    consultationLink: string;
   }> {
    try {
      console.log(
        "Log From Create COnverstaion  Data Source",
        doctorId,
        patientId
      );
      if (!MongoDbUserDataSource.isUserExists(patientId)) {
        throw new CustomError("USER_NOT_FOUND", 404);
      }
      const existingChat = await conversationModel.findOne({
        isGroupChat: false,
        $and: [
          { "members.memberType": "Doctor", "members.member": doctorId },
          { "members.memberType": "User", "members.member": patientId },
        ],
      });
      if (existingChat) {
        const constulationLink = await ConsultaionModel.createConsultaionLink(existingChat._id.toString(),appoinmentId)
        return {convId:existingChat._id.toString(),consultationLink:constulationLink}; // Return existing conversation ID
      } else {
        const newConversation = new conversationModel({
          members: [
            { member: doctorId, memberType: "Doctor" },
            { member: patientId, memberType: "User" },
          ],
        });

        await newConversation.save();
        const constulationLink = await ConsultaionModel.createConsultaionLink(newConversation._id.toString(),appoinmentId)
        return {convId:newConversation._id.toString(),consultationLink:constulationLink};
      }
    } catch (error: any) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw new CustomError(error.message || "Internal Server", 500);
      }
    }
  }

  async getChatsForUser(userId: string): Promise<Conversation[]> {
    try {
      console.log("A call from come in db chatsfor user");
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new CustomError("Invalid user id", 400);
      }
      const chats = await conversationModel.find({
        "members.member": userId,
      }).populate("members.member");

      return chats;

    } catch (error: any) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw new CustomError(error.message || "Internal Server", 500);
      }
    }
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

      const conversation = await conversationModel.findById(conversationId);
      if (!conversation) {
        throw new Error("Conversation not found");
      }

      const newMessage = new messageModel({
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
      const conv = await conversationModel.findById(convId).populate(
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
      const messages = await messageModel.find({ conversationId: convId });
      
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
