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
exports.ConsultationController = void 0;
const reponseHandler_1 = require("../../utils/reponseHandler");
const requestValidationMiddleware_1 = require("../../middlewares/requestValidationMiddleware");
const customError_1 = require("../../utils/customError");
class ConsultationController {
    constructor(consultationUseCase) {
        this.consultationUseCase = consultationUseCase;
    }
    getDoctors(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const queryParams = req.query;
                console.log("queryParams", queryParams);
                const data = yield this.consultationUseCase.getAllDoctors(queryParams);
                return (0, reponseHandler_1.sendSuccessResponse)(res, data, "Appoinment Successfully saved");
            }
            catch (error) {
                console.error('Error fetching While Editing the  User:', error);
                next(error);
            }
        });
    }
    makeAnAppoinment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const userId = req.user.id;
                const { doctorId } = req.params;
                console.log(req.body);
                const data = yield this.consultationUseCase.makeDoctorAppoinment(userId, doctorId, req.body.appoinmentData);
                return (0, reponseHandler_1.sendSuccessResponse)(res, data, "Appoinment Successfully saved");
            }
            catch (error) {
                console.error('Error fetching While Editing the  User:', error);
                next(error);
            }
        });
    }
    getAppoinmentDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const { appoinmentId } = req.params;
                console.log(req.body);
                const data = yield this.consultationUseCase.getAppoinmentDetails(appoinmentId);
                return (0, reponseHandler_1.sendSuccessResponse)(res, data, "Appoinment Successfully saved");
            }
            catch (error) {
                console.error('Error fetching While Editing the  User:', error);
                next(error);
            }
        });
    }
    createPayment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const { paymentMethod } = req.body;
                const { appoinmentId } = req.params;
                console.log(req.body);
                const data = yield this.consultationUseCase.createOrder(appoinmentId, paymentMethod);
                return (0, reponseHandler_1.sendSuccessResponse)(res, data, "Appoinment Successfully saved");
            }
            catch (error) {
                console.error('Error fetching While Editing the  User:', error);
                next(error);
            }
        });
    }
    verifyWebhook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId, paymentId, razorpaySignature } = req.body;
                const appoinmentId = yield this.consultationUseCase.verifyWebhook(orderId, paymentId, razorpaySignature);
                return (0, reponseHandler_1.sendSuccessResponse)(res, appoinmentId, "Appoinment Successfully saved");
            }
            catch (error) {
                next(error);
            }
        });
    }
    getDoctorAppoinments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const page = parseInt(req.query.page) || 1;
                const pageSize = parseInt(req.query.pageSize) || 6;
                const doctorId = req.user.id;
                console.log(doctorId);
                const data = yield this.consultationUseCase.getDoctorsAppoinments(doctorId, page, pageSize);
                return (0, reponseHandler_1.sendSuccessResponse)(res, data, "Appoinment Successfully saved");
            }
            catch (error) {
                console.error('Error fetching While Editing the  User:', error);
                next(error);
            }
        });
    }
    getUserAppoinments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const page = parseInt(req.query.page) || 1;
                const pageSize = parseInt(req.query.pageSize) || 6;
                const userId = req.user.id;
                console.log(userId);
                const data = yield this.consultationUseCase.getUsersAppoinments(userId, page, pageSize);
                return (0, reponseHandler_1.sendSuccessResponse)(res, data, "Appoinment Successfully saved");
            }
            catch (error) {
                console.error('Error fetching While Editing the  User:', error);
                next(error);
            }
        });
    }
    changeAppoinmentStatusByDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const appoinmentId = req.params.appointmentId;
                const userId = req.user.id;
                console.log(userId);
                const data = yield this.consultationUseCase.changeAppoinmentStatus(appoinmentId, req.body.status);
                return (0, reponseHandler_1.sendSuccessResponse)(res, data, "Appoinment status changed successfully");
            }
            catch (error) {
                console.error('Error fetching While Editing the  User:', error);
                next(error);
            }
        });
    }
    changeAppoinmentStatusByUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const appoinmentId = req.params.appointmentId;
                const userId = req.user.id;
                console.log(userId);
                const status = req.body.status;
                if (status !== 'Cancelled') {
                    throw new customError_1.CustomError('Invalid Status', 400);
                }
                const data = yield this.consultationUseCase.userAppoinmentCancellation(appoinmentId, 'Cancelled', userId);
                return (0, reponseHandler_1.sendSuccessResponse)(res, data, "Appoinment status changed successfully");
            }
            catch (error) {
                console.error('Error fetching While Editing the  User:', error);
                next(error);
            }
        });
    }
    getDoctorAvailableSlots(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const userId = req.user.id;
                let date;
                if (req.query.date) {
                    date = new Date(req.query.date);
                }
                else {
                    throw new customError_1.CustomError('Date is not Provided', 400);
                }
                const { doctorId } = req.params;
                console.log(userId);
                const data = yield this.consultationUseCase.getDoctorAvailableSlots(doctorId, date);
                return (0, reponseHandler_1.sendSuccessResponse)(res, data, "Doctor Slots are Fetched successfully");
            }
            catch (error) {
                console.error('Error fetching While Editing the  User:', error);
                next(error);
            }
        });
    }
}
exports.ConsultationController = ConsultationController;
