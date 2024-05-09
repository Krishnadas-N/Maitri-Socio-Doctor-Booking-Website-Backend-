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
exports.ChatController = void 0;
const customError_1 = require("../../utils/customError");
const requestValidationMiddleware_1 = require("../../middlewares/requestValidationMiddleware");
const reponseHandler_1 = require("../../utils/reponseHandler");
class ChatController {
    constructor(chatUseCase) {
        this.chatUseCase = chatUseCase;
    }
    createConversation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const { userId, appoinmentId } = req.params;
                const doctorId = req.user.id;
                if (!userId) {
                    throw new customError_1.CustomError('Missing user ID', 400);
                }
                const result = yield this.chatUseCase.createConverstation(doctorId, userId, appoinmentId);
                (0, reponseHandler_1.sendSuccessResponse)(res, result, 'Getting chats for the user was successful');
            }
            catch (error) {
                next(error);
            }
        });
    }
    getChatsForUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const userId = req.user.id;
                if (!userId) {
                    throw new customError_1.CustomError('Missing user ID', 400);
                }
                const chats = yield this.chatUseCase.getChatsForUser(userId);
                console.log("chats of the cuurent user", chats);
                (0, reponseHandler_1.sendSuccessResponse)(res, chats, 'Getting chats for the user was successful');
            }
            catch (error) {
                next(error);
            }
        });
    }
    closeChat(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chatId } = req.params;
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const doctorId = req.user.id;
                if (!chatId || !doctorId) {
                    throw new customError_1.CustomError('Missing chat ID or doctor ID', 400);
                }
                yield this.chatUseCase.closeChat(chatId, doctorId);
                (0, reponseHandler_1.sendSuccessResponse)(res, {}, 'Chats closed successfully');
            }
            catch (error) {
                next(error);
            }
        });
    }
    sendMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const senderId = req.user.id;
                const { message, messageType, receiverId, userType } = req.body;
                if (!senderId || !message || !messageType || !receiverId) {
                    throw new customError_1.CustomError('Missing required parameters', 400);
                }
                const savedMessage = yield this.chatUseCase.sendMessage(senderId, message, messageType, receiverId, userType);
                (0, reponseHandler_1.sendSuccessResponse)(res, savedMessage, 'Message sent successfully');
            }
            catch (error) {
                next(error);
            }
        });
    }
    getConversation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const { convId } = req.params;
                const savedMessage = yield this.chatUseCase.getConversation(convId);
                (0, reponseHandler_1.sendSuccessResponse)(res, savedMessage, 'Message sent successfully');
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ChatController = ChatController;
