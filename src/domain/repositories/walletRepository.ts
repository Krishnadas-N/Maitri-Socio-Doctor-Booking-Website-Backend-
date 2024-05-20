import { WalletDataSource } from "../../data/interfaces/data-sources/walletIDataSource";
import { TransactionDetailsByWeek } from "../../models/common.models";
import { Wallet } from "../entities/Wallet";
import { IWalletRepository } from "../interfaces/repositoryInterfaces/walletIRepository";


export class WalletRepository implements IWalletRepository{
    constructor(private walletModel:WalletDataSource) {}

    async getWallet(userId: string,page:number,pageSize:number): Promise<{ wallet: Wallet; page: number; pageSize: number; totalCount: number; totalPages: number }> {
        return this.walletModel.getWallet(userId,page,pageSize)
    }

    async detailsOftransactionperWeek(doctorId: string): Promise<TransactionDetailsByWeek[]> {
        return this.walletModel.detailsOftransactionperWeek(doctorId)
    }
   async getBalanceOfWallet(userId: string): Promise<number> {
       return this.walletModel.getBalanceOfWallet(userId); 
    }
}