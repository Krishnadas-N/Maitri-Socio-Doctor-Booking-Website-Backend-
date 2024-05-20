import { IwalletUseCase } from "../../domain/interfaces/use-cases/walletIUsecase";
import { assertHasUser } from "../../middlewares/requestValidationMiddleware";
import { NextFunction, Request, Response } from "express";
import { sendSuccessResponse } from "../../utils/reponseHandler"; 

export class WalletController{
    constructor(private walletUsecase:IwalletUseCase){}

    
    async getUserWallet(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 6;
            const userId = req.user.id as string;
            const data = await this.walletUsecase.getWallet(userId,page,pageSize );
            return  sendSuccessResponse(res, data,"Wallet reterived successFully");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }

    async getTransactionGraphDetails(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const userId = req.user.id as string;
            const data = await this.walletUsecase.detailsOftransactionperWeek(userId)
            return  sendSuccessResponse(res, data,"Wallet reterived successFully");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }

    async getWalletBalanceOfUser(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const userId = req.user.id as string;
            const data = await this.walletUsecase.getBalanceOfWallet(userId)
            return  sendSuccessResponse(res, data,"Wallet reterived successFully");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }

}