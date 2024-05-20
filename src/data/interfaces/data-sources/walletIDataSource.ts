import { Wallet } from "../../../domain/entities/Wallet";
import { TransactionDetailsByWeek } from "../../../models/common.models";

export interface WalletDataSource {
    refundCancellationAmountToUser(userId: string, refundAmount: number): Promise<Wallet>;
    getWallet(userId: string,page:number,pageSize:number): Promise<{ wallet: Wallet; page: number; pageSize: number; totalCount: number; totalPages: number }>;
    detailsOftransactionperWeek(doctorId: string): Promise<TransactionDetailsByWeek[]>;
    getBalanceOfWallet(userId: string): Promise<number> 
}

