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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultationRepoImpl = void 0;
const customError_1 = require("../../utils/customError");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
class ConsultationRepoImpl {
    constructor(consultationDataSource) {
        this.consultationDataSource = consultationDataSource;
    }
    makeInstance() {
        const instance = new razorpay_1.default({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        return instance;
    }
    makeDoctorAppoinment(userId, doctorId, appoinmentData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.consultationDataSource.makeAppoinment(userId, doctorId, appoinmentData);
        });
    }
    getAppoinment(appointmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.consultationDataSource.getAppoinment(appointmentId);
        });
    }
    createBookingPayment(appointmentId, paymentMethod) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const razorpay = this.makeInstance();
                const appoinment = yield this.consultationDataSource.findAppoinmentById(appointmentId);
                if (!appoinment) {
                    throw new customError_1.CustomError("Appointment not found", 404);
                }
                const options = {
                    amount: appoinment.amount * 100,
                    currency: 'INR',
                    receipt: `booking_${appointmentId}`,
                    payment_capture: 1 // Auto capture
                };
                const response = yield razorpay.orders.create(options);
                yield this.consultationDataSource.savePaymentDetails(appointmentId, appoinment.amount, paymentMethod, response.id);
                return { responseId: response.id, keyId: process.env.RAZORPAY_KEY_ID, amount: appoinment.amount };
            }
            catch (err) {
                if (err instanceof customError_1.CustomError) {
                    throw err;
                }
                else {
                    throw new customError_1.CustomError(err.message || 'Error while making an appointment', 500);
                }
            }
        });
    }
    verifyPayment(orderId, paymentId, razorpaySignature) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('razorpay', orderId, paymentId, razorpaySignature);
                const body = orderId + '|' + paymentId;
                const expectedSignature = crypto_1.default.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                    .update(body)
                    .digest('hex');
                if (expectedSignature !== razorpaySignature) {
                    throw new customError_1.CustomError("Invalid Signature", 403);
                }
                return yield this.consultationDataSource.updatePaymentToSuccess(orderId);
            }
            catch (err) {
                if (err instanceof customError_1.CustomError) {
                    throw err;
                }
                else {
                    throw new customError_1.CustomError(err.message || 'Error while making an appointment', 500);
                }
            }
        });
    }
    getAppoinmentsOfDoctors(doctorId, page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.consultationDataSource.getAppoinmentsOfDoctors(doctorId, page, pageSize);
        });
    }
    getAppoinmentsOfUsers(userId, page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.consultationDataSource.getAppoinmentsOfUsers(userId, page, pageSize);
        });
    }
    changeAppoinmentStatus(appoinmentId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.consultationDataSource.changeAppoinmentStatus(appoinmentId, status);
        });
    }
    getAvailableSlots(doctorId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.consultationDataSource.getAvailableSlots(doctorId, date);
        });
    }
    getDoctors(queryData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.consultationDataSource.getAllDoctors(queryData);
        });
    }
    userAppoinmentCancellation(appoinmentId, status, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.consultationDataSource.appoinmentCancellation(appoinmentId, status, userId);
        });
    }
}
exports.ConsultationRepoImpl = ConsultationRepoImpl;
