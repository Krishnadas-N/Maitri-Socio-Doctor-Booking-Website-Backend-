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
exports.UserController = void 0;
const customError_1 = require("../../utils/customError");
const reponseHandler_1 = require("../../utils/reponseHandler");
const requestValidationMiddleware_1 = require("../../middlewares/requestValidationMiddleware");
class UserController {
    constructor(userUseCase) {
        this.userUseCase = userUseCase;
    }
    loginUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const userData = yield this.userUseCase.login(email, password);
                console.log("Log form User", userData);
                if (!userData) {
                    throw new customError_1.CustomError("Email or Password is incorrect", 401);
                }
                return (0, reponseHandler_1.sendSuccessResponse)(res, userData, "Login successful");
            }
            catch (err) {
                next(err);
            }
        });
    }
    signupUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Log from Controllers (1)");
                const token = yield this.userUseCase.signUp(req.body);
                return (0, reponseHandler_1.sendSuccessResponse)(res, { token }, "User created successful");
            }
            catch (err) {
                console.log("Error passing yyy");
                next(err);
            }
        });
    }
    getUserProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const userId = req.user.id;
                console.log(userId, "User Id");
                const userProfile = yield this.userUseCase.profile(userId);
                return (0, reponseHandler_1.sendSuccessResponse)(res, userProfile, "user profile fetched successfully");
            }
            catch (error) {
                next(error);
            }
        });
    }
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const message = yield this.userUseCase.forgotPassword(email);
                return (0, reponseHandler_1.sendSuccessResponse)(res, message, 'Message sent Successfully');
            }
            catch (error) {
                next(error);
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const passwordToken = req.params.token;
                const { newPassword } = req.body;
                console.log(passwordToken, "token", newPassword);
                yield this.userUseCase.setResetPassword(passwordToken, newPassword);
                return (0, reponseHandler_1.sendSuccessResponse)(res, "Password Reset Successfully", "Password has been changed");
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const pageSize = parseInt(req.query.pageSize) || 10;
                const searchQuery = req.query.searchQuery || '';
                const users = yield this.userUseCase.getAllUsers(page, pageSize, searchQuery);
                console.log("use data");
                return (0, reponseHandler_1.sendSuccessResponse)(res, users, 'Message sent Successfully');
            }
            catch (error) {
                console.error('Error fetching users:', error);
                next(error); // Pass the error to your error handling middleware
            }
        });
    }
    BlockOrUnBlokUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const user = yield this.userUseCase.BlockOrUnblockUser(userId);
                return (0, reponseHandler_1.sendSuccessResponse)(res, user, 'Message sent Successfully');
            }
            catch (error) {
                console.error('Error fetching While Blocking User:', error);
                next(error);
            }
        });
    }
    getUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const userProfile = yield this.userUseCase.profile(userId);
                return (0, reponseHandler_1.sendSuccessResponse)(res, userProfile, "user profile fetched successfully");
            }
            catch (error) {
                console.error('Error fetching While Blocking User:', error);
                next(error);
            }
        });
    }
    editUserProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const userId = req.user.id;
                const { firstName, lastName, username, dateOfBirth, gender } = req.body;
                const updatedProfile = yield this.userUseCase.editUserProfile(userId, {
                    firstName,
                    lastName,
                    username,
                    dateOfBirth,
                    gender,
                });
                return (0, reponseHandler_1.sendSuccessResponse)(res, updatedProfile, "user profile Edited successfully");
            }
            catch (error) {
                console.error('Error fetching While Editing the  User:', error);
                next(error);
            }
        });
    }
    ChangeUserProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const userId = req.user.id;
                const imageUrl = req.body.cloudinaryUrls[0];
                console.log("image Url from COntrolelr", imageUrl);
                yield this.userUseCase.changeProfilePic(userId, imageUrl);
                return (0, reponseHandler_1.sendSuccessResponse)(res, imageUrl, "user profile Edited successfully");
            }
            catch (error) {
                console.error('Error fetching While Editing the  User:', error);
                next(error);
            }
        });
    }
    changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const userId = req.user.id;
                yield this.userUseCase.changeUserPassword(userId);
                return (0, reponseHandler_1.sendSuccessResponse)(res, {}, "Reset password Link shared Successfully to Your email");
            }
            catch (error) {
                console.error('Error fetching While Editing the  User:', error);
                next(error);
            }
        });
    }
    addUserMedicalRecord(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const { title, description } = req.body;
                const fileUrl = req.body.cloudinaryUrls[0];
                console.log("File url of medical record", fileUrl);
                const userId = req.user.id;
                const medicalRecord = yield this.userUseCase.addMedicalRecord(userId, fileUrl, title, description);
                if (!medicalRecord) {
                    throw new customError_1.CustomError('Failed to add medical record', 400);
                }
                return (0, reponseHandler_1.sendSuccessResponse)(res, medicalRecord, "new Medical record saved Successfully");
            }
            catch (error) {
                console.error('Error fetching While Editing the  User:', error);
                next(error);
            }
        });
    }
    getUserMedicalRecords(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const userId = req.user.id;
                const medicalRecord = yield this.userUseCase.getUserMedicalRecords(userId);
                console.log(medicalRecord);
                if (!medicalRecord) {
                    throw new customError_1.CustomError('Failed to get medical record', 400);
                }
                return (0, reponseHandler_1.sendSuccessResponse)(res, medicalRecord, "new Medical record saved Successfully");
            }
            catch (error) {
                console.error('Error fetching While Editing the  User:', error);
                next(error);
            }
        });
    }
}
exports.UserController = UserController;
