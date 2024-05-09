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
exports.AdminDataSource = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const customError_1 = require("../../../utils/customError");
const Admin_1 = require("../../../domain/entities/Admin");
const roleModel_1 = require("./models/roleModel");
const adminModel_1 = require("./models/adminModel");
class AdminDataSource {
    constructor() { }
    create(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roles = yield roleModel_1.roleModel.find({ _id: { $in: admin.roles } });
                if (roles.length !== admin.roles.length) {
                    throw new Error('Some roles not found');
                }
                const newAdmin = new adminModel_1.adminModel({
                    username: admin.username,
                    email: admin.email,
                    password: admin.password,
                    roles: roles.map(role => role._id.toString()),
                    createdAt: admin.createdAt,
                    updatedAt: admin.updatedAt
                });
                yield newAdmin.save();
            }
            catch (error) {
                if (error.code === 11000) {
                    throw new customError_1.CustomError('Username or email already exists', 409);
                }
                else {
                    throw new customError_1.CustomError(error.message || 'Failed to create admin', 500);
                }
            }
        });
    }
    findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminDocument = yield adminModel_1.adminModel.findOne({ username });
                if (adminDocument) {
                    const admin = Admin_1.Admin.fromJSON(adminDocument);
                    console.log(admin, "Log from Amdin");
                    return this.convertToDomain(admin);
                }
                else {
                    return null;
                }
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    throw new customError_1.CustomError(error.message || 'Failed to findByUsername', 500);
                }
            }
        });
    }
    findByemail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminDocument = yield adminModel_1.adminModel.findOne({ email });
                if (adminDocument) {
                    console.log(adminDocument, "Log from Amdin");
                    const admin = Admin_1.Admin.fromJSON(adminDocument);
                    console.log(admin, "Log from Amdin");
                    return this.convertToDomain(admin);
                }
                else {
                    return null;
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
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.default.Types.ObjectId.isValid(id))
                    throw new customError_1.CustomError("Invalid id", 400);
                const adminDocument = yield adminModel_1.adminModel.findById(id);
                if (adminDocument) {
                    const admin = Admin_1.Admin.fromJSON(adminDocument);
                    console.log(admin, "Log from Amdin");
                    return this.convertToDomain(admin);
                }
                else {
                    return null;
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
    fetchRoleDetails(roleIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roles = yield roleModel_1.roleModel.find({ _id: { $in: roleIds } });
                const roleDetails = roles.map(role => ({
                    roleId: role._id.toString(),
                    roleName: role.name,
                    permissions: role.permissions // Assuming your roleModel has a 'permissions' field
                }));
                return roleDetails;
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
    convertToDomain(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin)
                return null;
            console.log("log from converttodomain", admin);
            const roleIds = admin.roles.map(role => role.toString());
            const roleDetails = yield this.fetchRoleDetails(roleIds);
            return admin ? new Admin_1.Admin(admin.username, admin.password, admin.email, roleDetails, admin.createdAt, admin.updatedAt, admin._id // Convert ObjectId to string
            ).toJSON() : null;
        });
    }
}
exports.AdminDataSource = AdminDataSource;
