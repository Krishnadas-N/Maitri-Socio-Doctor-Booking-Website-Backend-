"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const appointmentSchema = new mongoose_1.default.Schema({
    patient: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    typeOfAppointment: {
        type: String,
        enum: ['video', 'chat', 'clinic'],
    },
    date: { type: Date, required: true }, // Separate field for date
    slot: { type: String, required: true },
    amount: { type: Number, required: true },
    duration: { type: Number, required: true, default: 60 },
    status: { type: String, enum: ['Pending', 'Scheduled', 'Completed', 'Cancelled', 'Rejected'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Refunded'], default: 'Pending' },
    payment: {
        amount: { type: Number },
        method: { type: String, enum: ['Credit Card', 'Debit Card', 'PayPal', 'Stripe', 'Razorpay'], },
        transactionId: { type: String },
        status: { type: String, enum: ['Success', 'Failed'], default: 'Success' },
    },
    consultationLink: {
        type: String
    },
}, {
    timestamps: true
});
const appointmentModel = mongoose_1.default.model("Appointment", appointmentSchema);
exports.appointmentModel = appointmentModel;
