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
exports.checkRolesAndPermissions = void 0;
const customError_1 = require("../utils/customError");
const requestValidationMiddleware_1 = require("./requestValidationMiddleware");
const checkRolesAndPermissions = (requiredRoles, requiredPermission) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            (0, requestValidationMiddleware_1.assertHasUser)(req);
            const user = req.user;
            console.log("Log form Auth ROle", req.user, user);
            if (!user || !req.user) {
                throw new customError_1.CustomError('User not found.', 401);
            }
            console.log("Require Roles", requiredRoles, user.roles);
            const hasRequiredRole = requiredRoles.some(role => user.roles.map((r) => r.roleName).includes(role));
            if (!hasRequiredRole) {
                throw new customError_1.CustomError('Access forbidden. Insufficient role.', 403);
            }
            console.log(hasRequiredRole);
            if (!user.roles.some((role) => role.permissions.includes(requiredPermission))) {
                throw new customError_1.CustomError('Access forbidden. Insufficient permissions.', 403);
            }
            next();
        }
        catch (error) {
            console.log("errror form  auth Role  middleware ", error);
            next(error); // Pass the error to the error handling middleware
        }
    });
};
exports.checkRolesAndPermissions = checkRolesAndPermissions;
