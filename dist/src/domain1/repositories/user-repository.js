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
exports.UserAuthenticationRepoImpl = void 0;
const CustomError_1 = require("../../../utils/CustomError");
class UserAuthenticationRepoImpl {
    constructor(userData) {
        this.dataSource = userData;
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Log from UserAuth Repo findBy email");
            const user = yield this.dataSource.findByEmail(email);
            if (!user) {
                throw new CustomError_1.CustomError(`User with email ${email} not found`, 404); // Update status to 404 for not found
            }
            return user;
        });
    }
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Log from UserAuth Repo getUser");
            const user = yield this.dataSource.findById(userId);
            if (!user) {
                throw new CustomError_1.CustomError(`User with ID ${userId} not found`, 404); // Update status to 404 for not found
            }
            return user;
        });
    }
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Log from UserAuth Repo save");
            return yield this.dataSource.create(user);
        });
    }
}
exports.UserAuthenticationRepoImpl = UserAuthenticationRepoImpl;
