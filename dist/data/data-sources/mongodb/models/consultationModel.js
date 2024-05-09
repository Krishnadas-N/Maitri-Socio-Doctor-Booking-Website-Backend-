"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consultationModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const consultationSchema = new mongoose_1.default.Schema({
    patient: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true }, // Duration in minutes
    consultationType: { type: String, enum: ['In-person', 'Video', 'Audio'], required: true },
    prescription: { type: String },
    createdAt: { type: Date, default: Date.now },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Refunded'], default: 'Pending' },
    payment: {
        type: {
            amount: {
                type: Number,
                required: true
            },
            method: {
                type: String,
                enum: ['Credit Card', 'Debit Card', 'PayPal', 'Stripe', 'Razorpay'],
                required: true
            },
            transactionId: {
                type: String,
                required: true
            },
            status: {
                type: String,
                enum: ['Success', 'Failed'],
                default: 'Success'
            },
        },
        required: true,
    }, // Payment status for the consultation
});
const consultationModel = mongoose_1.default.model("Consultation", consultationSchema);
exports.consultationModel = consultationModel;
