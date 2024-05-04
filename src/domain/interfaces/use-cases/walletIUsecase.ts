import { Wallet } from "../../entities/Wallet";

export interface IwalletUseCase{
    getWallet(userId:string):Promise<Wallet>;
}