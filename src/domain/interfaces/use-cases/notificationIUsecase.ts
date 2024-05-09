import { INotification } from "../../entities/Notification"


export interface INotificationUseCase{
    getNotificationById(notificationId:string):Promise<INotification | null>;
    getNotificationsOfReceiver(userId:string): Promise<INotification[]>
}