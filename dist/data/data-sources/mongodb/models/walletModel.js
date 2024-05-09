"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletModel = void 0;
const mongoose_1 = require("mongoose");
// Define wallet schema
const walletSchema = new mongoose_1.Schema({
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
    },
    transactions: [
        {
            type: {
                type: String,
                enum: ['credit', 'debit'],
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});
// Define wallet model
const walletModel = (0, mongoose_1.model)('Wallet', walletSchema);
exports.walletModel = walletModel;
