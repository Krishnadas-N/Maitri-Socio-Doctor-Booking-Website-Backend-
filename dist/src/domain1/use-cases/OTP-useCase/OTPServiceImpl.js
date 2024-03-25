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
const CustomError_1 = require("../../../../utils/CustomError");
class OTPServiceImpl {
    constructor(otpRepository) {
        this.otpRepository = otpRepository;
    }
    generateOTP() {
        return Math.floor(10000 + Math.random() * 900000).toString();
    }
    sendOTP(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpDocument = {
                email: email,
                otp: otp,
                status: 'NOTUSED',
                createdAt: new Date(),
                expiresAt: new Date(Date.now() * 60 * 1000)
            };
            yield this.otpRepository.save(otpDocument);
        });
    }
    verifyOTP(email, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = yield this.otpRepository.findByOwnerAndCode(email, code);
            if (!otp) {
                throw new CustomError_1.CustomError('Invalid Email', 404);
            }
            return otp.otp === code;
        });
    }
}
exports.OTPServiceImpl = OTPServiceImpl;
