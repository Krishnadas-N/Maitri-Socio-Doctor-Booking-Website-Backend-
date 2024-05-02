import { CustomError } from "../../../utils/CustomError";
import { ChatUseCase } from "../../domain/interfaces/use-cases/chat-Service/chat-IUsecase";
import { Request, Response,NextFunction } from 'express';
import { assertHasUser } from "../../middlewares/requestValidationMiddleware";
import { sendSuccessResponse } from "../../../utils/ReponseHandler";


export class ChatController {
    constructor(private chatUseCase: ChatUseCase) {}
    
    async createConversation(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            assertHasUser(req);

            const{userId}= req.params;
            const doctorId  = req.user.id as string;
            if (!userId) {
                throw new CustomError('Missing user ID', 400);
            }

            const conversationId = await this.chatUseCase.createConverstation(doctorId,userId);
            sendSuccessResponse(res,conversationId,'Getting chats for the user was successful');
        } catch (error) {
            next(error)
        }
    }

    async getChatsForUser(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            assertHasUser(req)
            const userId  = req.user.id as string;
            if (!userId) {
                throw new CustomError('Missing user ID', 400);
            }

            const chats = await this.chatUseCase.getChatsForUser(userId);
            sendSuccessResponse(res,chats,'Getting chats for the user was successful');
        } catch (error) {
            next(error)
        }
    }

    async closeChat(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            const { chatId } = req.params;
            assertHasUser(req)
            const doctorId  = req.user.id as string;
            
            if (!chatId || !doctorId) {
                throw new CustomError('Missing chat ID or doctor ID', 400);
            }

            await this.chatUseCase.closeChat(chatId, doctorId);
            sendSuccessResponse(res,{},'Chats closed successfully');
        }  catch (error) {
            next(error)
        }
    }

    async sendMessage(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            assertHasUser(req)
            const senderId = req.user.id as string;
            const { message, messageType, receiverId } = req.body;
            if (!senderId || !message || !messageType || !receiverId) {
                throw new CustomError('Missing required parameters', 400);
            }

            const savedMessage = await this.chatUseCase.sendMessage(senderId, message, messageType, receiverId);
            sendSuccessResponse(res,savedMessage,'Message sent successfully');
        } catch (error) {
            next(error)
        }
    }

    async getConversation(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            assertHasUser(req)
            const { convId }= req.params;

            const savedMessage = await this.chatUseCase.getConversation(convId)
            sendSuccessResponse(res,savedMessage,'Message sent successfully');
        } catch (error) {
            next(error)
        }
    }
}