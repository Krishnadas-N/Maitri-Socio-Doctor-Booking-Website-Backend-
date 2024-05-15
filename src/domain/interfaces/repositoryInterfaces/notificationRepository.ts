import { INotification } from "../../entities/Notification";


export interface INotificationRepository{
    getNotificationById(notificationId: string): Promise<INotification | null>;
    getNotificationsOfReceiver(userId:string): Promise<INotification[]>;
    createNotification(sender: string, senderModel: string, title:string,receivers: { receiverId: string, receiverModel: string }[], message: string): Promise<INotification>
}