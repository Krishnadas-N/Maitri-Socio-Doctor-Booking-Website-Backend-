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
exports.OTPServiceImpl = void 0;
const customError_1 = require("../../utils/customError");
const tokenizeDataHelper_1 = require("../../utils/tokenizeDataHelper");
class OTPServiceImpl {
    constructor(otpRepository, userRepository, doctorRepostory) {
        this.otpRepository = otpRepository;
        this.userRepository = userRepository;
        this.doctorRepostory = doctorRepostory;
    }
    verifyOTP(code, section) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(code, section, "From otp  service");
            const otp = yield this.otpRepository.findByOwnerAndCode(code);
            console.log("Log from use case VerifyOtp");
            console.log(otp);
            if (!otp) {
                throw new customError_1.CustomError("Invalid Email", 404);
            }
            if (otp.status === "USED") {
                throw new customError_1.CustomError("The Otp already Used", 409);
            }
            const currentTime = new Date().getTime();
            const createdAtTime = otp.createdAt.getTime();
            const elapsedTime = currentTime - createdAtTime;
            const validForMs = otp.validFor * 1000;
            if (elapsedTime > validForMs) {
                throw new customError_1.CustomError("OTP has expired", 400);
            }
            let token;
            switch (section) {
                case "user":
                    yield this.userRepository.markAsVerified(otp.email);
                    break;
                // case 'admin':
                //     await this.adminRepository.markAsVerified(email);
                //     break;
                case "doctor":
                    yield this.doctorRepostory.markAsVerified(otp.email);
                    token = yield (0, tokenizeDataHelper_1.generateToken)(otp.email); // Generate token for doctor
                    yield this.otpRepository.markAsUsed(otp.email);
                    return token; // Return the token
                default:
                    yield this.userRepository.markAsVerified(otp.email);
                    break;
            }
            yield this.otpRepository.markAsUsed(otp.email);
            return otp.otp === code;
        });
    }
    resendOtp(authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Log from use case resend otp");
                const ownerId = (0, tokenizeDataHelper_1.verifyToken)(authToken);
                if (!ownerId) {
                    throw new customError_1.CustomError('OTP is expired. Please register again with the same credentials.', 403);
                }
                yield this.otpRepository.resendOtp(ownerId.data);
            }
            catch (err) {
                console.error("Error occurred while resending OTP:", err);
                throw err; // Re-throw the error for the caller to handle
            }
        });
    }
}
exports.OTPServiceImpl = OTPServiceImpl;
