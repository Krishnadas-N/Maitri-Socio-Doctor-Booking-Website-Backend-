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
exports.OTPRepsositoryImpl = void 0;
const customError_1 = require("../../utils/customError");
const verifyEmailTamplate_1 = __importDefault(require("../../templates/verifyEmailTamplate"));
const node_mailer_1 = __importDefault(require("../../config/node-mailer"));
class OTPRepsositoryImpl {
    constructor(otpDataSource) {
        this.otpDataSource = otpDataSource;
    }
    findByOwnerAndCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpDoc = yield this.otpDataSource.findByEmail(code);
            if (!otpDoc) {
                throw new customError_1.CustomError('OTP does not exist or has expired', 404);
            }
            if (otpDoc.otp !== code) {
                throw new customError_1.CustomError('Incorrect OTP', 409);
            }
            return otpDoc;
        });
    }
    save(otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpId = yield this.otpDataSource.create(otp);
            console.log(otpId);
            return otpId;
        });
    }
    generateOTP() {
        let otp = Math.floor(100000 + Math.random() * 900000).toString();
        if (otp.length < 6) {
            otp = otp.padStart(6, '0');
        }
        return otp;
    }
    sendOTP(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.sendOtpTOMail(email, otp);
                console.log("otp Send SuccessFully");
                const otpDocument = {
                    email: email,
                    otp: otp,
                    status: 'NOTUSED',
                    validFor: 60,
                    createdAt: new Date(),
                    expiresAt: new Date(Date.now() + 60 * 1000),
                };
                const otpId = yield this.save(otpDocument);
                return otpId;
            }
            catch (error) {
                console.error('Error sending OTP:', error);
                throw new customError_1.CustomError('Error sending OTP', 500);
            }
        });
    }
    resendOtp(otpId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newOTP = this.generateOTP();
            console.log("\nNew Resend Otp generated", newOTP);
            try {
                const existingOTP = yield this.otpDataSource.findById(otpId);
                console.log(existingOTP, "\nexistingOTP");
                if (!existingOTP) {
                    throw new customError_1.CustomError('Invalid token or Otp Expires Please Register again', 423);
                }
                if (existingOTP) {
                    existingOTP.otp = newOTP;
                    existingOTP.validFor = 60;
                    existingOTP.createdAt = new Date();
                    existingOTP.expiresAt = new Date(Date.now() + 60 * 60 * 1000); // Add extra 2 minutes to the Expiry time for any retry of OTP
                    yield this.save(existingOTP);
                    yield this.sendOtpTOMail(existingOTP.email, newOTP);
                }
            }
            catch (error) {
                console.error('Error resending OTP:', error);
                throw new customError_1.CustomError('Error resending OTP', 500);
            }
        });
    }
    sendOtpTOMail(email, newOTP) {
        return __awaiter(this, void 0, void 0, function* () {
            const emailTemplate = (0, verifyEmailTamplate_1.default)(newOTP);
            const mailService = node_mailer_1.default.getInstance();
            try {
                yield mailService.createConnection();
                yield mailService.sendMail('X-Request-Id-Value', {
                    to: email,
                    subject: 'Verify OTP',
                    html: emailTemplate.html,
                });
            }
            catch (error) {
                console.error('Error resending OTP:', error);
                throw new customError_1.CustomError('Error resending OTP', 500);
            }
        });
    }
    markAsUsed(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.otpDataSource.updateStatus(email);
            }
            catch (error) {
                console.error('Error in Update the status OTP:', error);
                throw new customError_1.CustomError(error.message || 'Error updating OTP status', 500);
            }
        });
    }
}
exports.OTPRepsositoryImpl = OTPRepsositoryImpl;
