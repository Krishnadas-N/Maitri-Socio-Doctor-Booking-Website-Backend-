import { Wallet } from "../../../domain/entities/Wallet";

export interface WalletDataSource {
    refundCancellationAmountToUser(userId: string, refundAmount: number): Promise<Wallet>;
    getWallet(userId: string): Promise<Wallet>;
}

