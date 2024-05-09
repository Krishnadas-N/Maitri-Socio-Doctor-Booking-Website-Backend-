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
exports.ConsultaionModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const customError_1 = require("../../../utils/customError");
const appoinmentModel_1 = require("./models/appoinmentModel");
const doctorModel_1 = require("./models/doctorModel");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class ConsultaionModel {
    constructor(walletModel) {
        this.walletModel = walletModel;
    }
    makeAppoinment(userId, doctorId, appoinmentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.Types.ObjectId.isValid(userId) ||
                    !mongoose_1.Types.ObjectId.isValid(doctorId)) {
                    throw new customError_1.CustomError("Invalid User or Doctor ID", 400);
                }
                const doctorDetails = yield doctorModel_1.doctorModel.findOne({
                    _id: doctorId,
                    isBlocked: false,
                });
                if (!doctorDetails) {
                    throw new customError_1.CustomError("Doctor not found or Doctor is currently blocked. Please try again later.", 404);
                }
                const consultationFee = doctorDetails.consultationFee.find((data) => data.type === appoinmentData.typeofConsultaion);
                if (!consultationFee) {
                    throw new customError_1.CustomError("Consultation type fee not found.", 404);
                }
                const appointment = new appoinmentModel_1.appointmentModel({
                    patient: userId,
                    doctor: doctorDetails._id,
                    typeOfAppointment: appoinmentData.typeofConsultaion,
                    date: appoinmentData.bookingDate,
                    slot: appoinmentData.slotTime,
                    amount: consultationFee.fee,
                });
                yield appointment.save();
                return appointment._id;
            }
            catch (err) {
                if (err instanceof customError_1.CustomError) {
                    throw err;
                }
                else {
                    throw new customError_1.CustomError(err.message || "Error while making an appointment", 500);
                }
            }
        });
    }
    getAppoinment(appointmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.Types.ObjectId.isValid(appointmentId)) {
                    throw new customError_1.CustomError("Invalid Appoinment ID", 400);
                }
                const [appointment] = yield appoinmentModel_1.appointmentModel.aggregate([
                    {
                        $match: {
                            _id: new mongoose_1.default.Types.ObjectId(appointmentId),
                        },
                    },
                    {
                        $lookup: {
                            from: "doctors",
                            localField: "doctor",
                            foreignField: "_id",
                            as: "doctorInfo",
                        },
                    },
                    {
                        $lookup: {
                            from: "doctorcategories",
                            localField: "doctorInfo.specialization",
                            foreignField: "_id",
                            as: "doctorSpecialization",
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "patient",
                            foreignField: "_id",
                            as: "user",
                        },
                    },
                ]);
                if (!appointment) {
                    throw new customError_1.CustomError("Appoinment is not Found", 404);
                }
                return appointment;
            }
            catch (err) {
                if (err instanceof customError_1.CustomError) {
                    throw err;
                }
                else {
                    throw new customError_1.CustomError(err.message || "Error while making an appointment", 500);
                }
            }
        });
    }
    findAppoinmentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appointment = (yield appoinmentModel_1.appointmentModel.findOne({
                    _id: id,
                }));
                if (!appointment) {
                    throw new customError_1.CustomError("No Appointment found with the given ID", 404);
                }
                return appointment;
            }
            catch (err) {
                if (err instanceof customError_1.CustomError) {
                    throw err;
                }
                else {
                    throw new customError_1.CustomError(err.message || "Error while making an appointment", 500);
                }
            }
        });
    }
    savePaymentDetails(appointmentId, appoinmentAmount, paymentMethod, responseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appointment = yield appoinmentModel_1.appointmentModel.findOne({
                    _id: appointmentId,
                });
                if (!appointment) {
                    throw new customError_1.CustomError("No Appointment found with the given ID", 404);
                }
                appointment.payment = {
                    amount: appoinmentAmount,
                    method: paymentMethod,
                    transactionId: responseId,
                    status: "Success",
                };
                yield appointment.save();
            }
            catch (err) {
                if (err instanceof customError_1.CustomError) {
                    throw err;
                }
                else {
                    throw new customError_1.CustomError(err.message || "Error while making an appointment", 500);
                }
            }
        });
    }
    updatePaymentToSuccess(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appoinment = yield appoinmentModel_1.appointmentModel.findOneAndUpdate({ "payment.transactionId": orderId }, { $set: { paymentStatus: "Paid" } }, { new: true });
                if (!appoinment) {
                    throw new customError_1.CustomError("Appoinment Not Found Caused an error ", 422);
                }
                return appoinment._id;
            }
            catch (err) {
                console.error('Error updating payment status to "Paid":', err);
                throw new customError_1.CustomError(err.message || "Error while making an appointment", 500);
            }
        });
    }
    getAppoinmentsOfDoctors(doctorId, page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const offset = (page - 1) * pageSize;
                if (!mongoose_1.Types.ObjectId.isValid(doctorId)) {
                    throw new customError_1.CustomError("Invalid Doctor ID", 400);
                }
                const [appointments] = yield appoinmentModel_1.appointmentModel.aggregate([
                    {
                        $match: {
                            doctor: new mongoose_1.default.Types.ObjectId(doctorId),
                        },
                    },
                    {
                        $lookup: {
                            from: "doctors",
                            localField: "doctor",
                            foreignField: "_id",
                            as: "doctorInfo",
                        },
                    },
                    {
                        $lookup: {
                            from: "doctorcategories",
                            localField: "doctorInfo.specialization",
                            foreignField: "_id",
                            as: "doctorSpecialization",
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "patient",
                            foreignField: "_id",
                            as: "user",
                        },
                    },
                    {
                        $facet: {
                            appointments: [
                                { $sort: { createdAt: -1 } },
                                { $skip: offset },
                                { $limit: pageSize },
                            ], // retrieve all appointments
                            counts: [
                                {
                                    $group: {
                                        _id: null,
                                        pendingCount: {
                                            $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] },
                                        },
                                        scheduledCount: {
                                            $sum: { $cond: [{ $eq: ["$status", "Scheduled"] }, 1, 0] },
                                        },
                                        completedCount: {
                                            $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
                                        },
                                        cancelledCount: {
                                            $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] },
                                        },
                                        rejectedCount: {
                                            $sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] },
                                        },
                                    },
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        counts: {
                                            Pending: "$pendingCount",
                                            Scheduled: "$scheduledCount",
                                            Completed: "$completedCount",
                                            Cancelled: "$cancelledCount",
                                            Rejected: "$rejectedCount",
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $project: {
                            appointments: 1,
                            counts: { $arrayElemAt: ["$counts", 0] },
                        },
                    },
                ]);
                const totalCount = yield appoinmentModel_1.appointmentModel.countDocuments({ doctor: doctorId });
                const totalPages = Math.ceil(totalCount / pageSize);
                console.log("Docotr Appoinments", appointments);
                return {
                    appointments: appointments,
                    page,
                    pageSize,
                    totalCount,
                    totalPages,
                };
            }
            catch (err) {
                console.error('Error updating payment status to "Paid":', err);
                throw new customError_1.CustomError(err.message || "Error while making an appointment", 500);
            }
        });
    }
    getAppoinmentsOfUsers(userId, page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const offset = (page - 1) * pageSize;
                if (!mongoose_1.Types.ObjectId.isValid(userId)) {
                    throw new customError_1.CustomError("Invalid User ID", 400);
                }
                const appointments = yield appoinmentModel_1.appointmentModel.aggregate([
                    {
                        $match: {
                            patient: new mongoose_1.default.Types.ObjectId(userId),
                        },
                    },
                    {
                        $lookup: {
                            from: "doctors",
                            localField: "doctor",
                            foreignField: "_id",
                            as: "doctorInfo",
                        },
                    },
                    {
                        $lookup: {
                            from: "doctorcategories",
                            localField: "doctorInfo.specialization",
                            foreignField: "_id",
                            as: "doctorSpecialization",
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "patient",
                            foreignField: "_id",
                            as: "user",
                        },
                    },
                    {
                        $sort: { createdAt: -1 }
                    },
                    {
                        $skip: offset,
                    },
                    {
                        $limit: pageSize,
                    },
                ]);
                const totalCount = yield appoinmentModel_1.appointmentModel.countDocuments({ patient: userId });
                const totalPages = Math.ceil(totalCount / pageSize);
                return {
                    appointments: appointments,
                    page,
                    pageSize,
                    totalCount,
                    totalPages,
                };
            }
            catch (err) {
                console.error('Error updating payment status to "Paid":', err);
                throw new customError_1.CustomError(err.message || "Error while making an appointment", 500);
            }
        });
    }
    changeAppoinmentStatus(appoinmentId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appointment = (yield appoinmentModel_1.appointmentModel.findOneAndUpdate({ _id: appoinmentId }, { $set: { status: status } }, { new: true }));
                if (!appointment) {
                    throw new customError_1.CustomError("Appoinment Not Found Caused an error ", 422);
                }
                return appointment;
            }
            catch (err) {
                console.error('Error updating payment status to "Paid":', err);
                throw new customError_1.CustomError(err.message || "Error while making an appointment", 500);
            }
        });
    }
    getAvailableSlots(doctorId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Log form available slots", date);
                if (!mongoose_1.Types.ObjectId.isValid(doctorId)) {
                    throw new customError_1.CustomError("Invalid Doctor ID", 400);
                }
                const startOfDay = new Date(date);
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date(date);
                endOfDay.setHours(23, 59, 59, 999);
                const appointments = yield appoinmentModel_1.appointmentModel.find({
                    doctor: doctorId,
                    date: { $gte: startOfDay, $lte: endOfDay },
                    paymentStatus: { $ne: "Paid" }
                });
                const slots = [];
                for (let appointment of appointments) {
                    slots.push(appointment.slot);
                }
                console.log("Slots Booked ", slots);
                return slots;
            }
            catch (err) {
                console.error('Error updating payment status to "Paid":', err);
                throw new customError_1.CustomError(err.message || "Error while making an appointment", 500);
            }
        });
    }
    getAllDoctors(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {};
            // Filter by gender (if provided)
            if (filters.gender) {
                query.gender = { $in: filters.gender.split(",") };
                console.log("Filtering by gender:", filters.gender);
            }
            if (filters.availability) {
                const dayOfWeek = new Date().getDay(); // Get the current day of the week (0 = Sunday, 1 = Monday, ...)
                const availabilityArray = filters.availability.split(",");
                let slotRanges = [];
                // Define time ranges for each availability slot
                switch (dayOfWeek) {
                    case 0: // Sunday
                    case 6: // Saturday
                        slotRanges = [
                            { name: "morning", start: 8, end: 12 },
                            { name: "afternoon", start: 13, end: 18 },
                            { name: "evening", start: 19, end: 23 }
                        ];
                        break;
                    default: // Weekdays
                        slotRanges = [
                            { name: "morning", start: 9, end: 12 },
                            { name: "afternoon", start: 13, end: 17 },
                            { name: "evening", start: 18, end: 22 }
                        ];
                        break;
                }
                // Construct slots array based on availabilityArray and slotRanges
                const slots = availabilityArray.reduce((acc, slot) => {
                    const matchingRange = slotRanges.find(range => range.name === slot);
                    if (matchingRange) {
                        for (let i = matchingRange.start; i <= matchingRange.end; i++) {
                            // Adjust the formatting for hours greater than 12
                            const formattedHour = (i > 12 ? i - 12 : i).toString();
                            // Determine whether it's AM or PM
                            const period = i >= 12 ? 'pm' : 'am';
                            acc.push(`${formattedHour} ${period}`);
                        }
                    }
                    return acc;
                }, []);
                // Construct a query for matching the day of the week and available slots
                query.selectedSlots = {
                    $elemMatch: {
                        date: { $eq: new Date().setHours(0, 0, 0, 0) }, // Match the current day
                        slots: { $in: slots }
                    }
                };
                console.log("Filtering by availability:", filters.availability, JSON.stringify(slots), query.selectedSlots);
            }
            if (filters.speciality) {
                query.specialization = { $in: filters.speciality.split(",") };
                console.log("Filtering by speciality:", filters.speciality);
            }
            if (filters.experience) {
                const experienceRange = filters.experience.split("-");
                if (experienceRange.length === 2) {
                    query.experience = { $gte: parseInt(experienceRange[0]), $lte: parseInt(experienceRange[1]) };
                    console.log("Filtering by experience:", filters.experience);
                }
            }
            if (filters.consultation) {
                query.typesOfConsultation = { $in: filters.consultation.split(",") };
                console.log("Filtering by consultation type:", filters.consultation);
            }
            if (filters.rating) {
                const ratingArray = filters.rating.split(",").map(Number);
                query.rating = { $in: ratingArray };
                console.log("Filtering by rating:", filters.rating);
            }
            if (filters.languages) {
                query.languages = { $in: filters.languages.split(",") };
                console.log("Filtering by languages:", filters.languages);
            }
            if (filters.searchQuery) {
                const searchRegex = new RegExp(filters.searchQuery, 'i');
                query.$text = { $search: searchRegex.toString() };
                console.log("Filtering by search query:", filters.searchQuery, searchRegex);
            }
            const currentPage = parseInt(filters.currentPage) || 1;
            const pageSize = parseInt(filters.pageSize) || 6;
            const skip = (currentPage - 1) * pageSize;
            const totalCount = yield doctorModel_1.doctorModel.countDocuments(query);
            const totalPages = Math.ceil(totalCount / pageSize);
            console.log("Pagination: currentPage", currentPage, "pageSize", pageSize, "skip", skip);
            const sortOption = filters.sortOption || 'Newest';
            let sortQuery = {};
            if (sortOption === 'Newest') {
                sortQuery = { createdAt: -1 };
            }
            else if (sortOption === 'Oldest') {
                sortQuery = { createdAt: 1 };
            }
            else if (sortOption === 'Rating') {
                sortQuery = { rating: -1 };
            }
            else if (sortOption === 'Price: Low to High') {
                sortQuery = { 'consultationFee.fee': 1 };
            }
            else if (sortOption === 'Price: High to Low') {
                sortQuery = { 'consultationFee.fee': -1 };
            }
            console.log("Sorting:", sortOption, sortQuery);
            // Combine filters and pagination/sorting
            const doctors = yield doctorModel_1.doctorModel.find(query).populate('specialization').skip(skip).limit(pageSize).sort(sortQuery);
            console.log("Combined query:", query); // Log the final query string
            return {
                doctors,
                currentPage,
                pageSize,
                totalCount,
                totalPages,
            };
        });
    }
    static createConsultaionLink(convId, appoinmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appointment = yield appoinmentModel_1.appointmentModel.findById(appoinmentId);
                if (!appointment) {
                    throw new Error("Appointment not found");
                }
                let consultationLink;
                if (appointment.typeOfAppointment === 'chat') {
                    consultationLink = `${process.env.CHAT_CONSULATION_LINK}/${convId}`;
                }
                else if (appointment.typeOfAppointment === 'video') {
                    consultationLink = `${process.env.VIDEO_CONSULTATION_LINK}/${convId}`;
                }
                else {
                    throw new Error("Invalid appointment type");
                }
                yield appoinmentModel_1.appointmentModel.findByIdAndUpdate(appoinmentId, { consultationLink });
                return consultationLink;
            }
            catch (err) {
                console.error('Error updating payment status to "Paid":', err);
                throw new customError_1.CustomError(err.message || "Error while making an appointment", 500);
            }
        });
    }
    appoinmentCancellation(appoinmentId, status, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appointment = yield appoinmentModel_1.appointmentModel.findOneAndUpdate({ _id: appoinmentId }, { $set: { status: status } }, { new: true });
                if (!appointment) {
                    throw new customError_1.CustomError("Appointment Not Found", 422);
                }
                const refundAmount = appointment.amount * 0.7;
                appointment.paymentStatus = 'Refunded';
                const wallet = yield this.walletModel.refundCancellationAmountToUser(userId, refundAmount);
                console.log("wallet", wallet);
                yield appointment.save();
                return appointment;
            }
            catch (err) {
                console.error('Error updating appointment status:', err);
                throw new customError_1.CustomError(err.message || "Error while updating appointment status", 500);
            }
        });
    }
}
exports.ConsultaionModel = ConsultaionModel;
