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
exports.AdminController = void 0;
const customError_1 = require("../../utils/customError");
const Admin_1 = require("../../domain/entities/Admin");
const reponseHandler_1 = require("../../utils/reponseHandler");
class AdminController {
    constructor(adminUseCase) {
        this.adminUseCase = adminUseCase;
    }
    createAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password, roles } = req.body;
                const admin = new Admin_1.Admin(username, password, email, roles);
                yield this.adminUseCase.createAdmin(admin);
                return (0, reponseHandler_1.sendSuccessResponse)(res, {}, 'Admin created successfully');
            }
            catch (error) {
                next(error);
            }
        });
    }
    adminLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const AdminData = yield this.adminUseCase.adminLogin(email, password);
                return (0, reponseHandler_1.sendSuccessResponse)(res, AdminData, 'Admin created successfully');
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAdminByEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const admin = yield this.adminUseCase.getAdminByEmail(email);
                if (!admin) {
                    throw new customError_1.CustomError('Admin not found', 404);
                }
                return (0, reponseHandler_1.sendSuccessResponse)(res, admin, 'Admin retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAdminById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const admin = yield this.adminUseCase.getAdminById(id);
                if (!admin) {
                    throw new customError_1.CustomError('Admin not found', 404);
                }
                else {
                    return (0, reponseHandler_1.sendSuccessResponse)(res, admin, 'Admin retrieved successfully');
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAdminByUsername(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.params;
                const admin = yield this.adminUseCase.getAdminByUserName(username);
                if (!admin) {
                    throw new customError_1.CustomError('Admin not found', 404);
                }
                else {
                    return (0, reponseHandler_1.sendSuccessResponse)(res, admin, 'Admin retrieved successfully');
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AdminController = AdminController;
