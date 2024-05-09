import { CustomError } from "../../utils/customError";
import { INotification } from "../entities/Notification";
import { INotificationRepository } from "../interfaces/repositoryInterfaces/notificationRepository";
import { INotificationUseCase } from "../interfaces/use-cases/notificationIUsecase";


export class NotificationUsecase implements INotificationUseCase{
    constructor(private notifcationRepository:INotificationRepository){}

   async getNotificationById(notificationId: string): Promise<INotification|null> {
       try{
            if(!notificationId){
                throw new CustomError('NotificaitonId is not found',404)
            }
            return await this.notifcationRepository.getNotificationById(notificationId)
       }catch(err:unknown){
        if(err instanceof CustomError){
            throw err
        }else{
            const castedError = err as Error;
            throw new CustomError(castedError.message || 'Error occuring while accessing the notifications',500)
        }
       } 
    }

   async getNotificationsOfReceiver(userId: string): Promise<INotification[]> {
    try{
        if(!userId){
            throw new CustomError('userId is not found',404)
        }
        return await this.notifcationRepository.getNotificationsOfReceiver(userId);
   }catch(err:unknown){
    if(err instanceof CustomError){
        throw err
    }else{
        const castedError = err as Error;
        throw new CustomError(castedError.message || 'Error occuring while accessing the notifications',500)
    }
   }  
    }
}