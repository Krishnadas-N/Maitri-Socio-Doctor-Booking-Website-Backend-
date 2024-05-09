"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModelDataSource = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const customError_1 = require("../../../utils/customError");
const conversationalModel_1 = require("./models/conversationalModel");
const mongodbUserDataSource_1 = require("./mongodbUserDataSource");
const messageModel_1 = require("./models/messageModel");
const mongodbConsultationDataSource_1 = require("./mongodbConsultationDataSource");
class ChatModelDataSource {
    constructor() { }
    createConverstation(doctorId, patientId, appoinmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Log From Create COnverstaion  Data Source", doctorId, patientId);
                if (!mongodbUserDataSource_1.MongoDbUserDataSource.isUserExists(patientId)) {
                    throw new customError_1.CustomError("USER_NOT_FOUND", 404);
                }
                const existingChat = yield conversationalModel_1.conversationModel.findOne({
                    isGroupChat: false,
                    $and: [
                        { "members.memberType": "Doctor", "members.member": doctorId },
                        { "members.memberType": "User", "members.member": patientId },
                    ],
                });
                if (existingChat) {
                    const constulationLink = yield mongodbConsultationDataSource_1.ConsultaionModel.createConsultaionLink(existingChat._id.toString(), appoinmentId);
                    return { convId: existingChat._id.toString(), consultationLink: constulationLink }; // Return existing conversation ID
                }
                else {
                    const newConversation = new conversationalModel_1.conversationModel({
                        members: [
                            { member: doctorId, memberType: "Doctor" },
                            { member: patientId, memberType: "User" },
                        ],
                    });
                    yield newConversation.save();
                    const constulationLink = yield mongodbConsultationDataSource_1.ConsultaionModel.createConsultaionLink(newConversation._id.toString(), appoinmentId);
                    return { convId: newConversation._id.toString(), consultationLink: constulationLink };
                }
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    throw new customError_1.CustomError(error.message || "Internal Server", 500);
                }
            }
        });
    }
    getChatsForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("A call from come in db chatsfor user");
                if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                    throw new customError_1.CustomError("Invalid user id", 400);
                }
                const chats = yield conversationalModel_1.conversationModel.find({
                    "members.member": userId,
                }).populate("members.member");
                return chats;
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    throw new customError_1.CustomError(error.message || "Internal Server", 500);
                }
            }
        });
    }
    closeChat(chatId, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented");
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
        });
    }
    saveMessage(senderId, message, conversationId, receiverId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!senderId || !message || !conversationId || !receiverId) {
                    throw new customError_1.CustomError("Missing required parameters", 400);
                }
                const senderModel = userType === 'doctor' ? 'Doctor' : userType === 'user' ? 'User' : null;
                if (!senderModel) {
                    throw new customError_1.CustomError(`Invalid user type ${userType}`, 400);
                }
                const conversation = yield conversationalModel_1.conversationModel.findById(conversationId);
                if (!conversation) {
                    throw new Error("Conversation not found");
                }
                const newMessage = new messageModel_1.messageModel({
                    conversationId: conversationId,
                    senderId: senderId,
                    senderModel: senderModel,
                    content: { text: message },
                    messageType: "text",
                });
                return yield newMessage.save();
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    throw new customError_1.CustomError(error.message || "Internal Server", 500);
                }
            }
        });
    }
    getConversation(convId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.default.Types.ObjectId.isValid(convId)) {
                    throw new customError_1.CustomError("Invalid conversation id.", 400);
                }
                const conv = yield conversationalModel_1.conversationModel.findById(convId).populate("members.member");
                if (!conv) {
                    throw new Error("Conversation not found.");
                }
                console.log(conv);
                return conv;
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    throw new customError_1.CustomError(error.message || "Internal Server", 500);
                }
            }
        });
    }
    getMessages(convId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield messageModel_1.messageModel.find({ conversationId: convId });
                messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
                return messages;
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    throw new customError_1.CustomError(error.message || "Internal Server Error", 500);
                }
            }
        });
    }
}
exports.ChatModelDataSource = ChatModelDataSource;
