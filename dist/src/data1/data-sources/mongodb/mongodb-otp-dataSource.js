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
exports.MongoDbOtpDataSource = void 0;
const otp_Model_1 = __importDefault(require("./models/otp-Model"));
class MongoDbOtpDataSource {
    constructor() { }
    create(otpDoc) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = new otp_Model_1.default(otpDoc);
                yield otp.save();
            }
            catch (error) {
                console.error("Error saving OTP:", error);
                throw error;
            }
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otpDoc = yield otp_Model_1.default.findOne({ email }).exec();
                return otpDoc ? otpDoc.toObject() : null;
            }
            catch (error) {
                console.error("Error finding OTP by email:", error);
                throw error;
            }
        });
    }
}
exports.MongoDbOtpDataSource = MongoDbOtpDataSource;
