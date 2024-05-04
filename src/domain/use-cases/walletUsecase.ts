import { CustomError } from "../../utils/customError"; 
import { Wallet } from "../entities/Wallet";
import { IWalletRepository } from "../interfaces/repositoryInterfaces/walletIRepository";
import { IwalletUseCase } from "../interfaces/use-cases/walletIUsecase";


export class walletUseCase implements IwalletUseCase{
    
    constructor(private walletRepo:IWalletRepository) {}
    
    async getWallet(userId: string): Promise<Wallet> {
      try{
        if(!userId){
            throw new CustomError("userId is not provided",400)
        }
        return this.walletRepo.getWallet(userId)
      }catch(err:any){
        if(err instanceof CustomError){
            throw err
        }else{
            throw new CustomError(err.message ||'Error while Fetching Wallet',500)
        }
      } 
    }
}