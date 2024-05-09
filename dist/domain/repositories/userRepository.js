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
exports.UserRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const node_mailer_1 = __importDefault(require("../../config/node-mailer"));
const customError_1 = require("../../utils/customError");
const tokenizeDataHelper_1 = require("../../utils/tokenizeDataHelper");
const dotenv_1 = __importDefault(require("dotenv"));
const changePasswordTemplate_1 = __importDefault(require("../../templates/changePasswordTemplate"));
dotenv_1.default.config();
class UserRepository {
    constructor(userData) {
        this.dataSource = userData;
    }
    sendResetPasswordLinkEmail(email, resetLink) {
        return __awaiter(this, void 0, void 0, function* () {
            // Updated function name
            const emailTemplate = (0, changePasswordTemplate_1.default)(resetLink);
            const mailService = node_mailer_1.default.getInstance();
            try {
                yield mailService.createConnection();
                yield mailService.sendMail("X-Request-Id-Value", {
                    to: email,
                    subject: "Reset Password",
                    html: emailTemplate.html,
                });
            }
            catch (error) {
                console.error("Error sending reset password link:", error);
                throw new customError_1.CustomError("Error sending reset password link", 500);
            }
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Log from UserAuth Repo findBy email");
            const user = yield this.dataSource.findByEmail(email);
            return user;
        });
    }
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Log from UserAuth Repo getUser");
            const user = yield this.dataSource.findById(userId);
            if (!user) {
                throw new customError_1.CustomError(`User with ID ${userId} not found`, 404); // Update status to 404 for not found
            }
            return user;
        });
    }
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Log from UserAuth Repo save");
            return yield this.dataSource.create(user);
        });
    }
    markAsVerified(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dataSource.verifyUser(email);
        });
    }
    setResetToken(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.dataSource.findByEmail(email);
            if (!user) {
                throw new customError_1.CustomError("User is Not Found", 404);
            }
            const resetToken = yield (0, tokenizeDataHelper_1.generateRandomToken)();
            yield this.dataSource.saveResetToken(resetToken, email);
            const resetPasswordLink = `${process.env.UserResetPasswordLink}${resetToken}`;
            yield this.sendResetPasswordLinkEmail(email, resetPasswordLink); // Updated function name
        });
    }
    findResetTokenAndSavePassword(token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dataSource.findResetTokenAndSavePassword(token, password);
        });
    }
    getAllUsers(page, pageSize, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dataSource.getAllUsers(searchQuery, page, pageSize);
        });
    }
    toggleBlockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new customError_1.CustomError("Inavlid User Id", 400);
            }
            return yield this.dataSource.toggleBlockUser(id);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id) {
                    throw new customError_1.CustomError("Id is Not FOund", 404);
                }
                return yield this.dataSource.findById(id);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                console.error("Unexpected error:", error);
                throw new Error(error.message || "Internal server error");
            }
        });
    }
    updateUserProfile(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userId) {
                    throw new customError_1.CustomError("User Id is Not FOund", 404);
                }
                return yield this.dataSource.editProfile(userId, data);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                console.error("Unexpected error:", error);
                throw new Error(error.message || "Internal server error");
            }
        });
    }
    changeUserProfilePic(userId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.dataSource.changeProfilePic(userId, image);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                console.error("Unexpected error:", error);
                throw new Error(error.message || "Internal server error");
            }
        });
    }
    sendUserChangePasswordLink(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.dataSource.findById(userId);
                if (!user) {
                    throw new customError_1.CustomError("User is Not Found", 404);
                }
                console.log("user From Change password", user);
                const resetToken = yield (0, tokenizeDataHelper_1.generateRandomToken)();
                yield this.dataSource.saveResetToken(user.email, resetToken);
                const resetPasswordLink = `${process.env.UserResetPasswordLink}${resetToken}`;
                yield this.sendResetPasswordLinkEmail(user.email, resetPasswordLink);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                console.error("Unexpected error:", error);
                throw new Error(error.message || "Internal server error");
            }
        });
    }
    addMedicalRecord(userId, fileUrl, title, description) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dataSource.addMedicalRecord(userId, fileUrl, title, description);
        });
    }
    getMedicalRecords(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dataSource.getMedicalRecords(userId);
        });
    }
}
exports.UserRepository = UserRepository;
