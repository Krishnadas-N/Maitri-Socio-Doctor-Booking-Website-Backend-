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
exports.AuthMiddleware = void 0;
const passport_1 = __importDefault(require("passport"));
const customError_1 = require("../utils/customError");
class AuthMiddleware {
    constructor(userRepo, doctorRepo, adminRepo) {
        this.userRepo = userRepo;
        this.doctorRepo = doctorRepo;
        this.adminRepo = adminRepo;
    }
    isAuthenticated(req, res, next) {
        try {
            passport_1.default.authenticate("jwt", { session: false }, (err, payload, info) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (err)
                        return next(err);
                    if (!payload) {
                        throw new customError_1.CustomError("Unauthorized User", 403);
                    }
                    const now = Math.floor(Date.now() / 1000);
                    if (payload.exp && payload.exp < now) {
                        throw new customError_1.CustomError("Token has expired", 401);
                    }
                    let user;
                    switch (payload.roles[0].roleName) {
                        case "User":
                            user = yield this.userRepo.findById(payload.id);
                            break;
                        case "Doctor":
                            user = yield this.doctorRepo.findDoctorById(payload.id);
                            break;
                        case "Admin":
                            user = yield this.adminRepo.findById(payload.id);
                            break;
                        default:
                            throw new customError_1.CustomError("Unrecognized user role", 400);
                    }
                    if (!user) {
                        throw new customError_1.CustomError("User not found", 404);
                    }
                    if ("isBlocked" in user && user.isBlocked) {
                        throw new customError_1.CustomError("User is blocked by admin", 403);
                    }
                    req.user = payload;
                    return next();
                }
                catch (error) {
                    next(error);
                }
            }))(req, res, next);
        }
        catch (error) {
            console.log("errror form  auth   middleware ", error);
            next(error);
        }
    }
}
exports.AuthMiddleware = AuthMiddleware;
