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
exports.OTPRepsositoryImpl = void 0;
const CustomError_1 = require("../../../utils/CustomError");
class OTPRepsositoryImpl {
    constructor(otpDataSource) {
        this.otpDataSource = otpDataSource;
    }
    findByOwnerAndCode(email, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpDoc = yield this.otpDataSource.findByEmail(email);
            if (!otpDoc) {
                throw new CustomError_1.CustomError('OTP does not exist or has expired', 404);
            }
            if (otpDoc.otp !== code) {
                throw new CustomError_1.CustomError('Incorrect OTP', 409);
            }
            return otpDoc;
        });
    }
    save(otp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.save(otp);
        });
    }
}
exports.OTPRepsositoryImpl = OTPRepsositoryImpl;
