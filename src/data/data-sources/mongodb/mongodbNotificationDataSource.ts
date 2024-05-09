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
        }catch(err:unknown){
            if(err instanceof CustomError){
                throw err
            }else{
                const castedError = err as Error
                throw new CustomError(castedError.message || 'Error while fetching the notification',500)
            }
        }
    }

    async getNotificationOfReceiver(userId:string): Promise<INotification[]> {
        try {
            const notifications = await notificationModel.find({'receivers.receiverId':userId})
            .populate('sender')
            .populate('receivers.receiverId')
            .populate('readBy.reader');
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
   
}