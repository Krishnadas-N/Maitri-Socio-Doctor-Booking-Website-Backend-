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
exports.ChatRepositoryImpl = void 0;
class ChatRepositoryImpl {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    createConverstation(doctorId, patientId, appoinmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dataSource.createConverstation(doctorId, patientId, appoinmentId);
        });
    }
    getChatsForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dataSource.getChatsForUser(userId);
        });
    }
    closeChat(chatId, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dataSource.closeChat(chatId, doctorId);
        });
    }
    saveMessage(senderId, message, conversationId, receiverId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dataSource.saveMessage(senderId, message, conversationId, receiverId, userType);
        });
    }
    getConversation(convId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dataSource.getConversation(convId);
        });
    }
    getConversationMessages(convId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dataSource.getMessages(convId);
        });
    }
}
exports.ChatRepositoryImpl = ChatRepositoryImpl;
