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
exports.userLogin = void 0;
const CustomError_1 = require("../../../../utils/CustomError");
const PasswordUtils_1 = require("../../../../utils/PasswordUtils");
class userLogin {
    constructor(userRepo) {
        this.userRepository = userRepo;
    }
    execute(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Log from use cases (userLogin)");
            const user = yield this.userRepository.findByEmail(email);
            console.log(user);
            if (!user) {
                throw new CustomError_1.CustomError('No user Found', 404);
            }
            const isValidPassword = yield PasswordUtils_1.PasswordUtil.ComparePasswords(password, user.password);
            if (!isValidPassword) {
                throw new CustomError_1.CustomError('Invalid password', 409);
            }
            return user;
        });
    }
}
exports.userLogin = userLogin;
