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
exports.RoleController = void 0;
const customError_1 = require("../../utils/customError");
const reponseHandler_1 = require("../../utils/reponseHandler");
class RoleController {
    constructor(roleUseCase) {
        this.roleUseCase = roleUseCase;
    }
    createRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roleData = req.body;
                const newRole = yield this.roleUseCase.createNewRole(roleData);
                (0, reponseHandler_1.sendSuccessResponse)(res, newRole, "new Role created Successfully!");
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roleId = req.params.id;
                const deletedRole = yield this.roleUseCase.removeRole(roleId);
                if (!deletedRole) {
                    throw new customError_1.CustomError("Role not found", 404);
                }
                (0, reponseHandler_1.sendSuccessResponse)(res, deletedRole, "Deleted Successfully!");
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllRoles(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roles = yield this.roleUseCase.getAllRoles();
                (0, reponseHandler_1.sendSuccessResponse)(res, roles, " Roles Retrieved  Successfully!");
            }
            catch (error) {
                next(error);
            }
        });
    }
    getRoleDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roleId = req.params.id;
                const role = yield this.roleUseCase.getRoleDetails(roleId);
                if (!role) {
                    throw new customError_1.CustomError("Role not found", 404);
                }
                (0, reponseHandler_1.sendSuccessResponse)(res, role, " Role Retrieved  Successfully!");
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateRoleDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roleId = req.params.id;
                const updatedData = req.body;
                const updatedRole = yield this.roleUseCase.updateRoleDetails(roleId, updatedData);
                if (!updatedRole) {
                    throw new customError_1.CustomError("Role not found", 404);
                }
                (0, reponseHandler_1.sendSuccessResponse)(res, updatedRole, "Updated Successfully!");
            }
            catch (error) {
                next(error);
            }
        });
    }
    assignRolesToUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const roleIds = req.body.roleIds;
                yield this.roleUseCase.assignRolesToUser(userId, roleIds);
                const message = `Roles Assigned to User with id ${userId} successfully!`;
                (0, reponseHandler_1.sendSuccessResponse)(res, { message }, message);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.RoleController = RoleController;
