import { INotification } from "../../../domain/entities/Notification"


export interface NotificationModeIDataSource{
    getNotificationById(notificationId: string): Promise<INotification | null>;
    getNotificationOfReceiver(userId:string): Promise<INotification[]>;
    createNotification(sender: string, senderModel: string, title:string,receivers: { receiverId: string, receiverModel: string }[], message: string): Promise<INotification>
}