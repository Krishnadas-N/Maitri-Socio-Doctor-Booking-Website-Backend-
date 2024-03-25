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
exports.userSignup = void 0;
const CustomError_1 = require("../../../../utils/CustomError");
class userSignup {
    constructor(userRepository, otpService) {
        this.userRepository = userRepository;
        this.otpService = otpService;
    }
    execute(user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Log from use cases (userSignup)");
            const userIsExist = yield this.userRepository.findByEmail(user.email);
            if (userIsExist) {
                throw new CustomError_1.CustomError('User Already Exists', 409);
            }
            else {
                const savedUser = yield this.userRepository.save(user);
                const otp = this.otpService.generateOTP();
                yield this.otpService.sendOTP(savedUser.email, otp);
                return otp;
            }
        });
    }
}
exports.userSignup = userSignup;
