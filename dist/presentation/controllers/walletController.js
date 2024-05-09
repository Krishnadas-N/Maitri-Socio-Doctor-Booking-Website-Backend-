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
exports.WalletController = void 0;
const requestValidationMiddleware_1 = require("../../middlewares/requestValidationMiddleware");
const reponseHandler_1 = require("../../utils/reponseHandler");
class WalletController {
    constructor(walletUsecase) {
        this.walletUsecase = walletUsecase;
    }
    getUserWallet(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const userId = req.user.id;
                const wallet = yield this.walletUsecase.getWallet(userId);
                return (0, reponseHandler_1.sendSuccessResponse)(res, wallet, "Wallet reterived successFully");
            }
            catch (error) {
                console.error('Error fetching While Editing the  User:', error);
                next(error);
            }
        });
    }
}
exports.WalletController = WalletController;
