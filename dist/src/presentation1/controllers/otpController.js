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
exports.findOtp = void 0;
const CustomError_1 = require("../../../utils/CustomError");
const ReponseHandler_1 = require("../../../utils/ReponseHandler");
function findOtp(otpService) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Log from Controllers (1)");
                const isVerified = yield otpService.verifyOTP(req.body.email, req.body.otp);
                if (!isVerified) {
                    throw new CustomError_1.CustomError("Otp is incorrect or time Expired", 409);
                }
                return (0, ReponseHandler_1.sendSuccessResponse)(res, isVerified, "User created successful");
            }
            catch (err) {
                console.log("Error passing yyy");
                next(err);
            }
        });
    };
}
exports.findOtp = findOtp;
