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
exports.RoleRepository = void 0;
const customError_1 = require("../../utils/customError");
class RoleRepository {
    constructor(roleModel) {
        this.roleModel = roleModel;
    }
    createRole(roleData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Role Data From Database", roleData);
                const newRole = yield this.roleModel.createRole(roleData);
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
                const deletedRole = yield this.roleModel.deleteRole(roleId);
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
                const roles = yield this.roleModel.getAllRoles();
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
                const role = yield this.roleModel.getRoleById(roleId);
                return role;
            }
            catch (error) {
                console.error("Error fetching role by ID:", error);
                throw new customError_1.CustomError(error.message || "Failed to fetch role by ID", 500);
            }
        });
    }
    updateRole(roleId, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedRole = yield this.roleModel.updateRole(roleId, updatedData);
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
                yield this.roleModel.assignRolesToUser(userId, roleIds);
            }
            catch (error) {
                console.error("Error assigning roles to user:", error);
                throw new customError_1.CustomError(error.message || "Failed to assign roles to user", 500);
            }
        });
    }
}
exports.RoleRepository = RoleRepository;
