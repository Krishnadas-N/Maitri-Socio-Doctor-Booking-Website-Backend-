import { TransactionDetailsByWeek } from "../../models/common.models";
import { CustomError } from "../../utils/customError"; 
import { Wallet } from "../entities/Wallet";
import { IWalletRepository } from "../interfaces/repositoryInterfaces/walletIRepository";
import { IwalletUseCase } from "../interfaces/use-cases/walletIUsecase";


export class walletUseCase implements IwalletUseCase{
    
    constructor(private walletRepo:IWalletRepository) {}
    
    async getWallet(userId: string,page:number,pageSize:number): Promise<{ wallet: Wallet; page: number; pageSize: number; totalCount: number; totalPages: number }> {
      try{
        if(!userId){
            throw new CustomError("userId is not provided",400)
        }
        return this.walletRepo.getWallet(userId,page,pageSize)
      }catch (error:unknown) {
        if (error instanceof CustomError) {
            throw error;
        } else {
            const castedError = error as Error
      console.error('Unexpected error:', error);
      throw new CustomError(castedError.message || 'Internal server error',500);
        }
    } 
    }

   async detailsOftransactionperWeek(doctorId: string): Promise<TransactionDetailsByWeek[]> {
    try{
      if(!doctorId){
          throw new CustomError("userId is not provided",400)
      }    
    
      return this.walletRepo.detailsOftransactionperWeek(doctorId);
    
    }catch (error:unknown) {
        if (error instanceof CustomError) {
            throw error;
        } else {
            const castedError = error as Error
      console.error('Unexpected error:', error);
      throw new CustomError(castedError.message || 'Internal server error',500);
        }
    } 
    }

   async getBalanceOfWallet(userId: string): Promise<number> {
      try{
        if(!userId){
            throw new CustomError("userId is not provided",400)
        }    
      
        return this.walletRepo.getBalanceOfWallet(userId)
      }catch (error:unknown) {
          if (error instanceof CustomError) {
              throw error;
          } else {
              const castedError = error as Error
        console.error('Unexpected error:', error);
        throw new CustomError(castedError.message || 'Internal server error',500);
          }
      } 
    }
}