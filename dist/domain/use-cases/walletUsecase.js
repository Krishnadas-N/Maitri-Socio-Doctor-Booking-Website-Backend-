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
exports.walletUseCase = void 0;
const customError_1 = require("../../utils/customError");
class walletUseCase {
    constructor(walletRepo) {
        this.walletRepo = walletRepo;
    }
    getWallet(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userId) {
                    throw new customError_1.CustomError("userId is not provided", 400);
                }
                return this.walletRepo.getWallet(userId);
            }
            catch (err) {
                if (err instanceof customError_1.CustomError) {
                    throw err;
                }
                else {
                    throw new customError_1.CustomError(err.message || 'Error while Fetching Wallet', 500);
                }
            }
        });
    }
}
exports.walletUseCase = walletUseCase;
