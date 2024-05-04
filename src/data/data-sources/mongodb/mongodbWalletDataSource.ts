import { CustomError } from "../../../utils/customError"; 
import { Transaction, Wallet } from "../../../domain/entities/Wallet";
import {walletModel} from "./models/walletModel";


export class WalletDataSource {
    constructor(){}

    async refundCancellationAmountToUser(userId: string,refundAmount:number): Promise<Wallet> {
        try {
            const userWallet = await this.initializeWallet(userId);

            const updatedBalance = userWallet.balance + refundAmount;

            const transaction: Transaction = {
                type: 'credit',
                amount: refundAmount,
                description: 'Refund for cancelled appointment',
                date: new Date()
            };

            userWallet.balance = updatedBalance;
            userWallet.transactions.push(transaction);

            const updatedWallet = await userWallet.save();

            return updatedWallet;
        } catch (error: any) {
            // Handle errors
            throw new CustomError(`Error refunding cancellation amount to user ${userId}: ${error.message}`,500);
        }
    }

    private async initializeWallet(userId: string): Promise<Wallet> {
        try {
            const existingWallet = await walletModel.findOne({ owner: userId });

            if (!existingWallet) {
                const newWallet = new walletModel({
                    owner: userId,
                    balance: 0,
                    transactions: []
                });
                return await newWallet.save();
            }

            return existingWallet;
        } catch (error: any) {
            // Handle errors
            throw new CustomError(`Error initializing wallet for user ${userId}: ${error.message}`,500);
        }
    }

    async getWallet(userId: string): Promise<Wallet> {
        const wallet = await this.initializeWallet(userId);
        return wallet;
    }
}
