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
exports.RoleUseCase = void 0;
const customError_1 = require("../../utils/customError");
class RoleUseCase {
    constructor(roleRepository) {
        this.roleRepository = roleRepository;
    }
    createNewRole(roleData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.roleRepository.createRole(roleData);
            }
            catch (error) {
                console.error("Error creating new role:", error);
                throw new customError_1.CustomError("Failed to create new role", 500);
            }
        });
    }
    removeRole(roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.roleRepository.deleteRole(roleId);
            }
            catch (error) {
                console.error("Error removing role:", error);
                throw new customError_1.CustomError("Failed to remove role", 500);
            }
        });
    }
    getAllRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.roleRepository.getAllRoles();
            }
            catch (error) {
                console.error("Error fetching all roles:", error);
                throw new customError_1.CustomError("Failed to fetch all roles", 500);
            }
        });
    }
    getRoleDetails(roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.roleRepository.getRoleById(roleId);
            }
            catch (error) {
                console.error("Error fetching role details:", error);
                throw new customError_1.CustomError("Failed to fetch role details", 500);
            }
        });
    }
    updateRoleDetails(roleId, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.roleRepository.updateRole(roleId, updatedData);
            }
            catch (error) {
                console.error("Error updating role details:", error);
                throw new customError_1.CustomError("Failed to update role details", 500);
            }
        });
    }
    assignRolesToUser(userId, roleIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.roleRepository.assignRolesToUser(userId, roleIds);
            }
            catch (error) {
                console.error("Error assigning roles to user:", error);
                throw new customError_1.CustomError("Failed to assign roles to user", 500);
            }
        });
    }
}
exports.RoleUseCase = RoleUseCase;
