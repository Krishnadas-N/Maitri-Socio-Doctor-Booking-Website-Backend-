"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletDataSource = void 0;
const customError_1 = require("../../../utils/customError");
const walletModel_1 = require("./models/walletModel");
class WalletDataSource {
    constructor() { }
    refundCancellationAmountToUser(userId, refundAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userWallet = yield this.initializeWallet(userId);
                const updatedBalance = userWallet.balance + refundAmount;
                const transaction = {
                    type: 'credit',
                    amount: refundAmount,
                    description: 'Refund for cancelled appointment',
                    date: new Date()
                };
                userWallet.balance = updatedBalance;
                userWallet.transactions.push(transaction);
                const updatedWallet = yield userWallet.save();
                return updatedWallet;
            }
            catch (error) {
                // Handle errors
                throw new customError_1.CustomError(`Error refunding cancellation amount to user ${userId}: ${error.message}`, 500);
            }
        });
    }
    initializeWallet(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingWallet = yield walletModel_1.walletModel.findOne({ owner: userId });
                if (!existingWallet) {
                    const newWallet = new walletModel_1.walletModel({
                        owner: userId,
                        balance: 0,
                        transactions: []
                    });
                    return yield newWallet.save();
                }
                return existingWallet;
            }
            catch (error) {
                // Handle errors
                throw new customError_1.CustomError(`Error initializing wallet for user ${userId}: ${error.message}`, 500);
            }
        });
    }
    getWallet(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield this.initializeWallet(userId);
            return wallet;
        });
    }
}
exports.WalletDataSource = WalletDataSource;
