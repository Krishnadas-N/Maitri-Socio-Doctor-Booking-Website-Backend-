import { TransactionDetailsByWeek } from "../../../models/common.models";
import { Wallet } from "../../entities/Wallet";

export interface IWalletRepository{
    getWallet(userId:string,page:number,pageSize:number):Promise<{ wallet: Wallet; page: number; pageSize: number; totalCount: number; totalPages: number }>;
    detailsOftransactionperWeek(doctorId: string): Promise<TransactionDetailsByWeek[]>;
    getBalanceOfWallet(userId: string): Promise<number> 
}