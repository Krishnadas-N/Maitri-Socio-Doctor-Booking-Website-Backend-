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
exports.MongoDbOtpDataSource = void 0;
const otpModel_1 = require("./models/otpModel");
class MongoDbOtpDataSource {
    constructor() { }
    create(otpDoc) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(otpDoc);
                const existingOTP = yield otpModel_1.otpModel.findOne({ email: otpDoc.email });
                if (existingOTP) {
                    yield otpModel_1.otpModel.findOneAndUpdate({ email: otpDoc.email }, otpDoc);
                    return existingOTP._id.toString(); // Return the ID of the existing OTP document
                }
                else {
                    const otp = new otpModel_1.otpModel(otpDoc);
                    const savedOTP = yield otp.save();
                    return savedOTP._id.toString(); // Return the ID of the newly created OTP document
                }
            }
            catch (error) {
                console.error("Error saving OTP:", error);
                throw error;
            }
        });
    }
    findByEmail(otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otpDoc = yield otpModel_1.otpModel.findOne({ otp: otp }).exec();
                return otpDoc ? otpDoc.toObject() : null;
            }
            catch (error) {
                console.error("Error finding OTP by email:", error);
                throw error;
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(id);
                const otpDoc = yield otpModel_1.otpModel.findById(id).exec();
                console.log(otpDoc);
                return otpDoc ? otpDoc.toObject() : null;
            }
            catch (error) {
                console.error("Error finding OTP by email:", error);
                throw error;
            }
        });
    }
    updateStatus(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield otpModel_1.otpModel.updateOne({ email }, { $set: { status: 'USED' } });
            }
            catch (error) {
                console.error("Error finding OTP by email:", error);
                throw error;
            }
        });
    }
}
exports.MongoDbOtpDataSource = MongoDbOtpDataSource;
