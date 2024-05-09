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
exports.ResendOtpMiddleware = exports.VerifyOtpMiddleware = void 0;
const customError_1 = require("../../utils/customError");
const reponseHandler_1 = require("../../utils/reponseHandler");
class VerifyOtpMiddleware {
    constructor(otpService) {
        this.otpService = otpService;
    }
    handle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Log from Controllers Verify otp");
                const data = yield this.otpService.verifyOTP(req.body.otp, req.body.section);
                if (!data) {
                    throw new customError_1.CustomError("Otp is incorrect or time Expired", 409);
                }
                return (0, reponseHandler_1.sendSuccessResponse)(res, data, "User created successful");
            }
            catch (err) {
                console.log("Error passing yyy");
                next(err);
            }
        });
    }
}
exports.VerifyOtpMiddleware = VerifyOtpMiddleware;
class ResendOtpMiddleware {
    constructor(otpService) {
        this.otpService = otpService;
    }
    handle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Log from Controllers of Resend otp ", req.body.authToken);
                yield this.otpService.resendOtp(req.body.authToken);
                return (0, reponseHandler_1.sendSuccessResponse)(res, {}, "User created successful");
            }
            catch (err) {
                console.log("Error passing yyy");
                next(err);
            }
        });
    }
}
exports.ResendOtpMiddleware = ResendOtpMiddleware;
