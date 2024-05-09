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
exports.ConsultationUseCaseImpl = void 0;
const customError_1 = require("../../utils/customError");
const consultation_model_1 = require("../../models/consultation.model");
class ConsultationUseCaseImpl {
    constructor(consultationRepo) {
        this.consultationRepo = consultationRepo;
    }
    makeDoctorAppoinment(userId, doctorId, appoinmentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userId || !doctorId) {
                    throw new customError_1.CustomError('UserId or DoctorId is not Provided', 403);
                }
                if (!appoinmentData.typeofConsultaion || !['video', 'chat', 'clinic'].includes(appoinmentData.typeofConsultaion)) {
                    throw new customError_1.CustomError('Invalid type of consultation', 400);
                }
                const parsedBookingDate = new Date(appoinmentData.bookingDate);
                if (isNaN(parsedBookingDate.getTime())) {
                    throw new customError_1.CustomError('Invalid booking date', 400);
                }
                if (!appoinmentData.slotTime || typeof appoinmentData.slotTime !== 'string' || appoinmentData.slotTime.trim() === '') {
                    throw new customError_1.CustomError('Invalid slot time', 400);
                }
                return this.consultationRepo.makeDoctorAppoinment(userId, doctorId, appoinmentData);
            }
            catch (err) {
                if (err instanceof customError_1.CustomError) {
                    throw err;
                }
                else {
                    throw new customError_1.CustomError(err.message || 'Error while make an appoinment', 500);
                }
            }
        });
    }
    getAppoinmentDetails(appointmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!appointmentId) {
                    throw new customError_1.CustomError('No Appoinment Id is Provided', 400);
                }
                return this.consultationRepo.getAppoinment(appointmentId);
            }
            catch (err) {
                if (err instanceof customError_1.CustomError) {
                    throw err;
                }
                else {
                    throw new customError_1.CustomError(err.message || 'Error while make an appoinment', 500);
                }
            }
        });
    }
    createOrder(appointmentId, paymentMethod) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!appointmentId) {
                    throw new customError_1.CustomError('No Appointment Id is Provided', 400);
                }
                return yield this.consultationRepo.createBookingPayment(appointmentId, paymentMethod);
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
    verifyWebhook(orderId, paymentId, razorpaySignature) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!orderId || !paymentId || !razorpaySignature) {
                    throw new customError_1.CustomError('No Appointment Id, Payment Id, or Razorpay Signature is Provided', 400);
                }
                return yield this.consultationRepo.verifyPayment(orderId, paymentId, razorpaySignature);
            }
            catch (err) {
                if (err instanceof customError_1.CustomError) {
                    throw err;
                }
                else {
                    throw new customError_1.CustomError(err.message || 'Error while verifying webhook', 500);
                }
            }
        });
    }
    getUsersAppoinments(userId, page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userId) {
                    throw new customError_1.CustomError('User Id is Not Provided', 400);
                }
                return this.consultationRepo.getAppoinmentsOfUsers(userId, page, pageSize);
            }
            catch (err) {
                if (err instanceof customError_1.CustomError) {
                    throw err;
                }
                else {
                    throw new customError_1.CustomError(err.message || 'Error while make an appoinment', 500);
                }
            }
        });
    }
    getDoctorsAppoinments(doctorId, page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!doctorId) {
                    throw new customError_1.CustomError('Doctor Id is Not Provided', 400);
                }
                return this.consultationRepo.getAppoinmentsOfDoctors(doctorId, page, pageSize);
            }
            catch (err) {
                if (err instanceof customError_1.CustomError) {
                    throw err;
                }
                else {
                    throw new customError_1.CustomError(err.message || 'Error while make an appoinment', 500);
                }
            }
        });
    }
    changeAppoinmentStatus(appoinmentId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!appoinmentId) {
                    throw new customError_1.CustomError('Appoinment Id is Not Provided', 400);
                }
                if (!consultation_model_1.allowedStatuses.includes(status)) {
                    throw new customError_1.CustomError('Invalid appointment status', 400);
                }
                return this.consultationRepo.changeAppoinmentStatus(appoinmentId, status);
            }
            catch (err) {
                if (err instanceof customError_1.CustomError) {
                    throw err;
                }
                else {
                    throw new customError_1.CustomError(err.message || 'Error while make an appoinment', 500);
                }
            }
        });
    }
    getDoctorAvailableSlots(doctorId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!doctorId) {
                    throw new customError_1.CustomError('Doctor Id is Not Provided', 400);
                }
                if (!(date instanceof Date && !isNaN(date.getTime()))) {
                    throw new customError_1.CustomError('Invalid Date', 400);
                }
                return this.consultationRepo.getAvailableSlots(doctorId, date);
            }
            catch (err) {
                if (err instanceof customError_1.CustomError) {
                    throw err;
                }
                else {
                    throw new customError_1.CustomError(err.message || 'Error while make an appoinment', 500);
                }
            }
        });
    }
    getAllDoctors(queryData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.consultationRepo.getDoctors(queryData);
            }
            catch (err) {
                if (err instanceof customError_1.CustomError) {
                    throw err;
                }
                else {
                    throw new customError_1.CustomError(err.message || 'Error while make an appoinment', 500);
                }
            }
        });
    }
    userAppoinmentCancellation(appoinmentId, status, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!appoinmentId || !status || !userId) {
                    throw new customError_1.CustomError("Invalid arguments", 400);
                }
                return this.consultationRepo.userAppoinmentCancellation(appoinmentId, status, userId);
            }
            catch (err) {
                if (err instanceof customError_1.CustomError) {
                    throw err;
                }
                else {
                    throw new customError_1.CustomError(err.message || 'Error while make an appoinment', 500);
                }
            }
        });
    }
}
exports.ConsultationUseCaseImpl = ConsultationUseCaseImpl;
// export const consultationService = (
