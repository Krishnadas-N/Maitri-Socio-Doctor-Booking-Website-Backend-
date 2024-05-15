import { NotificationModeIDataSource } from "../../data/interfaces/data-sources/notificationIDataSource";
import { INotification } from "../entities/Notification";
import { INotificationRepository } from "../interfaces/repositoryInterfaces/notificationRepository";


export class NotificationRepository implements INotificationRepository{
    constructor(private notificationDataSource:NotificationModeIDataSource){}

    async getNotificationById(notificationId: string): Promise<INotification | null> {
        return this.notificationDataSource.getNotificationById(notificationId);
    }

    async getNotificationsOfReceiver(userId: string): Promise<INotification[]> {
        return this.notificationDataSource.getNotificationOfReceiver(userId);
    }
    createNotification(sender: string, senderModel: string, title: string, receivers: { receiverId: string; receiverModel: string; }[], message: string): Promise<INotification> {
        return this.notificationDataSource.createNotification(sender,senderModel,title,receivers,message)
    }
}