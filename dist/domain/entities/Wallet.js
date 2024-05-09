"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
class Wallet {
    constructor(owner, balance, transactions) {
        this.owner = owner;
        this.balance = balance;
        this.transactions = transactions;
    }
}
exports.Wallet = Wallet;
