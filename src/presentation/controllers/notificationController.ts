import { Request,Response, NextFunction} from "express";
import { INotificationUseCase } from "../../domain/interfaces/use-cases/notificationIUsecase";
import { assertHasUser } from "../../middlewares/requestValidationMiddleware";
import { sendSuccessResponse } from "../../utils/reponseHandler";


export class NotificationController{
    constructor(private notificationUseCase:INotificationUseCase){}

    async getNotificationOfUser(req: Request, res: Response, next: NextFunction){
        try{
        assertHasUser(req)
         const userId = req.user.id as string;
         console.log(userId,"User Id");
         const userNtoifcations = await this.notificationUseCase.getNotificationsOfReceiver(userId)
         return  sendSuccessResponse(res, userNtoifcations,"user notifications fetched successfully");
        }catch(error){
            next(error)
        }
    }
}