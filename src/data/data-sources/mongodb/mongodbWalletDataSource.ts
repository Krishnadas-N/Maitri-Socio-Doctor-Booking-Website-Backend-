import { CustomError } from "../../../utils/customError"; 
import { Transaction, Wallet } from "../../../domain/entities/Wallet";
import {walletModel} from "./models/walletModel";
import { TransactionDetailsByWeek } from "../../../models/common.models";
import { Types } from "mongoose";


export class WalletDataSource {
    constructor(){}
    
    private getWeekNumber(date: Date): number {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(), 0, 1);
        const weekNo = Math.ceil((Number(d) - Number(yearStart)) / (86400000 * 7));
        return weekNo;
    }

    private getWeekStartDate(date: Date): string {
        const d = new Date(date);
        d.setDate(d.getDate() - d.getDay() + 1); // Adjust to the start of the week (Monday)
        const year = d.getFullYear();
        const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`;
        const day = d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`;
        return `${year}-${month}-${day}`;
    }
    

    async addAmountToUserWallet(userId: string, amount: number): Promise<Wallet> {
    try {
        const userWallet = await this.initializeWallet(userId);

        const updatedBalance = userWallet.balance + amount;

        const transaction: Transaction = {
            type: 'credit',
            amount: amount,
            description: 'Amount added after appointment',
            date: new Date()
        };

        userWallet.balance = updatedBalance;
        userWallet.transactions.push(transaction);

        const updatedWallet = await userWallet.save();

        return updatedWallet;
    } catch (error: unknown) {
        if (error instanceof CustomError) {
            throw error;
        } else {
            const castedError = error as Error;
            console.error('Unexpected error:', error);
            throw new CustomError(castedError.message || 'Internal server error', 500);
        }
    }
}

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
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
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
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
    }

    async getWallet(userId: string, page: number, pageSize: number): Promise<{ wallet: Wallet; page: number; pageSize: number; totalCount: number; totalPages: number }> {
        try {
            const existingWallet = await walletModel.findOne({ owner: userId });
    
            if (!existingWallet) {
                const newWallet = new walletModel({
                    owner: userId,
                    balance: 0,
                    transactions: []
                });
                await newWallet.save();
                return {
                    wallet: newWallet,
                    page,
                    pageSize,
                    totalCount: 0,
                    totalPages: 0
                };
            }
    
            const totalCount = existingWallet.transactions.length;
            const totalPages = Math.ceil(totalCount / pageSize);
    
            const startIndex = (page - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize, totalCount);
    
            const paginatedTransactions = existingWallet.transactions.slice(startIndex, endIndex);
    
            return {
                wallet: { ...existingWallet.toObject(), transactions: paginatedTransactions },
                page,
                pageSize,
                totalCount,
                totalPages
            };
        } catch (error) {
            console.error("Error while fetching wallet:", error);
            throw error;
        }
    }
    
    async detailsOftransactionperWeek(doctorId: string): Promise<TransactionDetailsByWeek[]> {
        try { 
            const transactionsByWeek: TransactionDetailsByWeek[] = [];
            const walletDetails = await walletModel.findOne({ owner: doctorId });
            if (!walletDetails) {
                return transactionsByWeek; 
            }
    
            // Group transactions by week start dates
            const transactionsGroupedByWeek = new Map<string, TransactionDetailsByWeek>();
            walletDetails.transactions.forEach(transaction => {
                const weekStartDate = this.getWeekStartDate(transaction.date);
                if (!transactionsGroupedByWeek.has(weekStartDate)) {
                    transactionsGroupedByWeek.set(weekStartDate, {
                        startDate: weekStartDate,
                        credit: 0,
                        debit: 0
                    });
                }
                const week = transactionsGroupedByWeek.get(weekStartDate)!; // "!" ensures that the value is present
                if (transaction.type === 'credit') {
                    week.credit += transaction.amount; 
                } else {
                    week.debit += transaction.amount; 
                }
            });
    
            // Convert map values to array
            transactionsByWeek.push(...transactionsGroupedByWeek.values());
    
            return transactionsByWeek;
        } catch (error) {
            console.error("Error while fetching wallet:", error);
            throw error;
        }
    }
    
    
    async getBalanceOfWallet(userId: string): Promise<number> {
        try {
            const wallet = await walletModel.findOne({ owner:userId })
            console.log("Wallllllllllllllllllet Details ",wallet)
          if (wallet) {
            return wallet.balance;
          } else {
            const newWallet = new walletModel({
                owner: userId,
                balance: 0,
                transactions: []
            });
            await newWallet.save();
            return 0;
          }
        } catch (error) {
            console.error("Error while fetching balance wallet:", error);
            throw error;
        }
    }
    

}
