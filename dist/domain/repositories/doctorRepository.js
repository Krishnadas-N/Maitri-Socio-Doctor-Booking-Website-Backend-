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
exports.IDoctorRepositoryImpl = void 0;
const node_mailer_1 = __importDefault(require("../../config/node-mailer"));
const changePasswordTemplate_1 = __importDefault(require("../../templates/changePasswordTemplate"));
const confimrationEmailTemplate_1 = __importDefault(require("../../templates/confimrationEmailTemplate"));
const customError_1 = require("../../utils/customError");
const tokenizeDataHelper_1 = require("../../utils/tokenizeDataHelper");
class IDoctorRepositoryImpl {
    constructor(doctorDataSource) {
        this.doctorDataSource = doctorDataSource;
    }
    findDoctorByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.doctorDataSource.findByEmail(email);
                return result ? result : null;
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    console.error("An unexpected error occurred:", error);
                    throw new customError_1.CustomError(error.message || "An unexpected error occurred.", 500);
                }
            }
        });
    }
    findDoctorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Entry COmess in frist ........................");
                if (!id) {
                    throw new customError_1.CustomError('Invalid Id', 400);
                }
                console.log("LOG from  doctorBY id    ", id);
                const doctor = yield this.doctorDataSource.findById(id);
                return doctor ? doctor : null;
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    console.error("An unexpected error occurred:", error);
                    throw new customError_1.CustomError(error.message || "An unexpected error occurred.", 500);
                }
            }
        });
    }
    saveBasicInfo(doctor) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctorId = yield this.doctorDataSource.DbsaveBasicInfo(doctor);
                return doctorId;
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    console.error("An unexpected error occurred:", error);
                    throw new customError_1.CustomError(error.message || "An unexpected error occurred.", 500);
                }
            }
        });
    }
    saveAdditionalInfo(doctor, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.doctorDataSource.DbsaveAdditionalInfo(doctor, doctorId);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    console.error("An unexpected error occurred:", error);
                    throw new customError_1.CustomError(error.message || "An unexpected error occurred.", 500);
                }
            }
        });
    }
    saveProfessionalInfo(doctor, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(doctorId, doctor, "comsole from reposootory profrssional info");
                return yield this.doctorDataSource.DbsaveProfessionalInfo(doctor, doctorId);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    console.error("An unexpected error occurred:", error);
                    throw new customError_1.CustomError(error.message || "An unexpected error occurred.", 500);
                }
            }
        });
    }
    markAsVerified(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.doctorDataSource.verifyDoctor(email);
        });
    }
    setResetToken(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.doctorDataSource.findByEmail(email);
            if (!user) {
                throw new customError_1.CustomError('User is Not Found', 404);
            }
            const resetToken = yield (0, tokenizeDataHelper_1.generateRandomToken)();
            yield this.doctorDataSource.saveResetToken(email, resetToken);
            const resetPasswordLink = `${process.env.DoctorResetPasswordLink}${resetToken}`;
            yield this.sendResetPasswordLinkEmail(email, resetPasswordLink); // Updated function name
        });
    }
    findResetTokenAndSavePassword(token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.doctorDataSource.findResetTokenAndSavePassword(token, password);
        });
    }
    AcceptDoctorProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doctor = yield this.doctorDataSource.AcceptprofileComplete(id);
            yield this.sendConfrimationEmailToDoctor(doctor.email);
            return doctor;
        });
    }
    GetDoctors(page, searchQuery, itemsPerPage) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.doctorDataSource.findDoctors(page, searchQuery, itemsPerPage);
        });
    }
    changeStatusofDoctor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.doctorDataSource.changeStatusofDoctor(id);
        });
    }
    changeProfilePic(doctorId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.doctorDataSource.changeProfilePic(doctorId, image);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                console.error("Unexpected error:", error);
                throw new Error(error.message || "Internal server error");
            }
        });
    }
    saveSelectedSlots(doctorId, selectedSlots) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.doctorDataSource.saveSelectedSlots(doctorId, selectedSlots);
            }
            catch (error) {
                // Handle error
                console.error("Error in saving selected slots:", error);
                throw error;
            }
        });
    }
    // async getBookedSlots(date: Date): Promise<string[]> {
    //     return await this.doctorDataSource.getBookedSlots(date);
    // }
    sendResetPasswordLinkEmail(email, resetLink) {
        return __awaiter(this, void 0, void 0, function* () {
            const emailTemplate = (0, changePasswordTemplate_1.default)(resetLink);
            const mailService = node_mailer_1.default.getInstance();
            try {
                yield mailService.createConnection();
                yield mailService.sendMail('X-Request-Id-Value', {
                    to: email,
                    subject: 'Reset Password',
                    html: emailTemplate.html,
                });
            }
            catch (error) {
                console.error('Error sending reset password link:', error);
                throw new customError_1.CustomError('Error sending reset password link', 500);
            }
        });
    }
    sendConfrimationEmailToDoctor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const emailTemplate = (0, confimrationEmailTemplate_1.default)('http://localhost:4200/doctor/login');
            const mailService = node_mailer_1.default.getInstance();
            try {
                yield mailService.createConnection();
                yield mailService.sendMail('X-Request-Id-Value', {
                    to: email,
                    subject: 'Confrimation Email',
                    html: emailTemplate.html,
                });
            }
            catch (error) {
                console.error('Error sending Confrimation Emai:', error);
                throw new customError_1.CustomError('Error sending Confrimation Emai', 500);
            }
        });
    }
}
exports.IDoctorRepositoryImpl = IDoctorRepositoryImpl;
