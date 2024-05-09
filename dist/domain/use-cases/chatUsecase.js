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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatUseCaseImpl = void 0;
const customError_1 = require("../../utils/customError");
class ChatUseCaseImpl {
    constructor(repository) {
        this.repository = repository;
    }
    getChatsForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new customError_1.CustomError('Missing user ID', 400);
            }
            return yield this.repository.getChatsForUser(userId);
        });
    }
    closeChat(chatId, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!chatId || !doctorId) {
                throw new customError_1.CustomError('Missing chat ID or doctor ID', 400);
            }
            yield this.repository.closeChat(chatId, doctorId);
        });
    }
    sendMessage(senderId, message, conversationId, receiverId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!senderId || !message || !conversationId || !receiverId) {
                throw new customError_1.CustomError('Missing required parameters', 400);
            }
            return yield this.repository.saveMessage(senderId, message, conversationId, receiverId, userType);
        });
    }
    createConverstation(doctorId, patientId, appoinmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!doctorId || !patientId) {
                    throw new customError_1.CustomError('Invalid data provided', 400);
                }
                return this.repository.createConverstation(doctorId, patientId, appoinmentId);
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
                if (!convId) {
                    throw new customError_1.CustomError('Invalid Conversation id provided', 400);
                }
                return this.repository.getConversation(convId);
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
    getIndividualMessages(convId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!convId) {
                    throw new customError_1.CustomError('Invalid parameter provided', 400);
                }
                return this.repository.getConversationMessages(convId);
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
}
exports.ChatUseCaseImpl = ChatUseCaseImpl;
