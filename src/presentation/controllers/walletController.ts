import { IwalletUseCase } from "../../domain/interfaces/use-cases/walletIUsecase";
import { assertHasUser } from "../../middlewares/requestValidationMiddleware";
import { NextFunction, Request, Response } from "express";
import { sendSuccessResponse } from "../../utils/reponseHandler"; 

export class WalletController{
    constructor(private walletUsecase:IwalletUseCase){}

    
    async getUserWallet(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const userId = req.user.id as string;
            const wallet = await this.walletUsecase.getWallet(userId );
            return  sendSuccessResponse(res, wallet,"Wallet reterived successFully");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }
}