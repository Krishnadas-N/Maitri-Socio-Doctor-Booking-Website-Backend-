import { INotification } from "../../entities/Notification";


export interface INotificationRepository{
    getNotificationById(notificationId: string): Promise<INotification | null>;
    getNotificationsOfReceiver(userId:string): Promise<INotification[]>
}