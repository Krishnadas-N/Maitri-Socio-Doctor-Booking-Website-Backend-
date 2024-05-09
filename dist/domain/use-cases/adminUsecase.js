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
exports.AdminUsecase = void 0;
const customError_1 = require("../../utils/customError");
const passwordUtils_1 = require("../../utils/passwordUtils");
const passportUtils_1 = require("../../utils/passportUtils");
class AdminUsecase {
    constructor(repository) {
        this.repository = repository;
    }
    createAdmin(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.repository.create(admin);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    throw new customError_1.CustomError(error.message || 'Failed to findByemail', 500);
                }
            }
        });
    }
    adminLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email || !password) {
                    throw new customError_1.CustomError('Email and password are required', 400);
                }
                const admin = yield this.repository.findByEmail(email);
                console.log(admin, "log from usecase");
                if (!admin) {
                    throw new customError_1.CustomError('Admin not found', 404);
                }
                const passwordMatch = yield passwordUtils_1.PasswordUtil.comparePasswords(password, admin.password);
                if (!passwordMatch) {
                    throw new customError_1.CustomError('Invalid email or password', 401);
                }
                if (admin && admin._id) {
                    const tokenData = (0, passportUtils_1.issueJWT)({ _id: admin._id.toString(), roles: admin.roles });
                    console.log(tokenData);
                    return { admin, token: tokenData.token };
                }
                else {
                    throw new customError_1.CustomError('Id is not found in Admin', 404);
                }
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    throw new customError_1.CustomError(error.message || 'Failed to findByemail', 500);
                }
            }
        });
    }
    getAdminByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield this.repository.findByEmail(email);
                return admin;
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    throw new customError_1.CustomError(error.message || 'Failed to findByemail', 500);
                }
            }
        });
    }
    getAdminById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield this.repository.findById(id);
                return admin;
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    throw new customError_1.CustomError(error.message || 'Failed to findByemail', 500);
                }
            }
        });
    }
    getAdminByUserName(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield this.repository.findByUsername(userName);
                return admin;
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    throw new customError_1.CustomError(error.message || 'Failed to findByemail', 500);
                }
            }
        });
    }
}
exports.AdminUsecase = AdminUsecase;
