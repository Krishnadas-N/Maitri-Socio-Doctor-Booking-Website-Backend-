import { INotification } from "../../../domain/entities/Notification"


export interface NotificationModeIDataSource{
    getNotificationById(notificationId: string): Promise<INotification | null>;
    getNotificationOfReceiver(userId:string): Promise<INotification[]>;
}