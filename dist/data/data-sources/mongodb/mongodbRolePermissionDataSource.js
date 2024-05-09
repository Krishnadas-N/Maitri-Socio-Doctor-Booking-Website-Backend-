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
exports.RoleModelImpl = void 0;
const customError_1 = require("../../../utils/customError");
const roleModel_1 = require("./models/roleModel");
const userModel_1 = require("./models/userModel");
class RoleModelImpl {
    constructor() { }
    createRole(roleData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Role Data From Database", roleData);
                const newRole = yield roleModel_1.roleModel.create(roleData);
                return newRole;
            }
            catch (error) {
                console.error("Error creating role:", error);
                throw new customError_1.CustomError(error.message || "Failed to create role", 500);
            }
        });
    }
    deleteRole(roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedRole = yield roleModel_1.roleModel.findByIdAndDelete(roleId);
                return deletedRole;
            }
            catch (error) {
                console.error("Error deleting role:", error);
                throw new customError_1.CustomError(error.message || "Failed to delete role", 500);
            }
        });
    }
    getAllRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roles = yield roleModel_1.roleModel.find({});
                return roles;
            }
            catch (error) {
                console.error("Error fetching roles:", error);
                throw new customError_1.CustomError(error.message || "Failed to fetch roles", 500);
            }
        });
    }
    getRoleById(roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const role = yield roleModel_1.roleModel.findById(roleId);
                return role;
            }
            catch (error) {
                console.error("Error fetching role by ID:", error);
                throw new customError_1.CustomError(error.message || "Failed to fetch role b,500y ID", 500);
            }
        });
    }
    updateRole(roleId, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedRole = yield roleModel_1.roleModel.findByIdAndUpdate(roleId, updatedData, { new: true });
                return updatedRole;
            }
            catch (error) {
                console.error("Error updating role:", error);
                throw new customError_1.CustomError(error.message || "Failed to update role", 500);
            }
        });
    }
    assignRolesToUser(userId, roleIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Update user document with new role IDs
                yield userModel_1.userModel.findByIdAndUpdate(userId, { $set: { roles: roleIds } });
            }
            catch (error) {
                console.error("Error updating role:", error);
                throw new customError_1.CustomError(error.message || "Failed to update role", 500);
            }
        });
    }
}
exports.RoleModelImpl = RoleModelImpl;
