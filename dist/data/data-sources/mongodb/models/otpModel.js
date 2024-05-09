"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const otpSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    otp: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 6,
        unique: true,
    },
    status: {
        type: String,
        enum: ['USED', 'NOTUSED'],
        default: 'NOTUSED'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    validFor: {
        type: Number,
        required: true,
        default: 60 // Default to 60 seconds
    },
    expiresAt: {
        type: Date,
        expires: 60,
        default: () => (Date.now() + 60 * 60 * 1000)
    },
});
const otpModel = mongoose_1.default.model('OtpModel', otpSchema);
exports.otpModel = otpModel;
