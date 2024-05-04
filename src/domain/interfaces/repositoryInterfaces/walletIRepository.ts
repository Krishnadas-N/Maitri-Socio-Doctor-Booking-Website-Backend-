import { Wallet } from "../../entities/Wallet";

export interface IWalletRepository{
    getWallet(userId:string):Promise<Wallet>
}