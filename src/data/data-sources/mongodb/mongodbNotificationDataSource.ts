import { INotification } from "../../../domain/entities/Notification";
import { CustomError } from "../../../utils/customError";
import { NotificationModeIDataSource } from "../../interfaces/data-sources/notificationIDataSource";
import notificationModel from "./models/notificationModel";

export class NotificationDataSource implements NotificationModeIDataSource {
    constructor(){}

    async  getNotificationById(notificationId: string): Promise<INotification | null> {
        try {
            const notification = await notificationModel.findById(notificationId);
            return notification ? notification : null;
        }catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
    }

    async getNotificationOfReceiver(userId:string): Promise<INotification[]> {
        try {
            const notifications = await notificationModel.find({'receivers.receiverId':userId})
            .populate('sender')
            .populate('receivers.receiverId')
            .populate('readBy.reader').sort({createdAt:-1});
            console.log(userId,"notitfications of the user",notifications)
            return notifications;
        }catch(err:unknown){
            if(err instanceof CustomError){
                throw err
            }else{
                const castedError = err as Error
                throw new CustomError(castedError.message || 'Error while fetching the notification',500)
            }
        }
    }

    async createNotification(sender: string, senderModel: string, title:string,receivers: { receiverId: string, receiverModel: string }[], message: string): Promise<INotification> {
        try {
            const notificationData = {
                sender: sender,
                senderModel: senderModel,
                receivers: receivers,
                title:title, 
                message: message
            };
    
            const newNotification = await notificationModel.create(notificationData);
    
            return newNotification;
        } catch (err: unknown) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                const castedError = err as Error;
                throw new CustomError(castedError.message || 'Error while creating the notification', 500);
            }
        }
    }
    
   
}      