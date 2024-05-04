import { WalletDataSource } from "../../data/interfaces/data-sources/walletIDataSource";
import { Wallet } from "../entities/Wallet";
import { IWalletRepository } from "../interfaces/repositoryInterfaces/walletIRepository";


export class WalletRepository implements IWalletRepository{
    constructor(private walletModel:WalletDataSource) {}

    async getWallet(userId: string): Promise<Wallet> {
        return this.walletModel.getWallet(userId)
    }
}