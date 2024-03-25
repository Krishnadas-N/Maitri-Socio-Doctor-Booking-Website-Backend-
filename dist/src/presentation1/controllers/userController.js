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
exports.loginController = exports.signupController = void 0;
const CustomError_1 = require("../../../utils/CustomError");
const ReponseHandler_1 = require("../../../utils/ReponseHandler");
function signupController(userSignup) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Log from Controllers (1)");
                const newUser = yield userSignup.execute(req.body);
                return (0, ReponseHandler_1.sendSuccessResponse)(res, newUser, "User created successful");
            }
            catch (err) {
                console.log("Error passing yyy");
                next(err);
            }
        });
    };
}
exports.signupController = signupController;
function loginController(userLogin) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield userLogin.execute(email, password);
                if (!user) {
                    throw new CustomError_1.CustomError("Email or Password is incorrect", 401);
                }
                return (0, ReponseHandler_1.sendSuccessResponse)(res, user, "Login successful");
            }
            catch (err) {
                next(err);
            }
        });
    };
}
exports.loginController = loginController;
