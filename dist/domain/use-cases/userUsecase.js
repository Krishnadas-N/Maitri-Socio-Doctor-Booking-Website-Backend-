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
exports.UserUseCase = void 0;
const customError_1 = require("../../utils/customError");
const passwordUtils_1 = require("../../utils/passwordUtils");
const passportUtils_1 = require("../../utils/passportUtils");
const tokenizeDataHelper_1 = require("../../utils/tokenizeDataHelper");
class UserUseCase {
    constructor(userRepository, otpRepository) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Log from use cases (userLogin)");
            const user = yield this.userRepository.findByEmail(email);
            console.log(user);
            if (!user) {
                throw new customError_1.CustomError("No user Found", 404);
            }
            if (!user.isVerified) {
                throw new customError_1.CustomError("User is Not Verified", 403);
            }
            const isValidPassword = yield passwordUtils_1.PasswordUtil.comparePasswords(password, user.password);
            if (!isValidPassword) {
                throw new customError_1.CustomError("Invalid password", 409);
            }
            console.log(email, password);
            if (user && user._id) {
                console.log(email, password);
                const tokenData = (0, passportUtils_1.issueJWT)({
                    _id: user._id.toString(),
                    roles: user.roles || [],
                });
                console.log(tokenData);
                return { user, token: tokenData.token };
            }
            else {
                throw new customError_1.CustomError("Id is not found in User", 404);
            }
        });
    }
    signUp(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userIsExist = yield this.userRepository.findByEmail(user.email);
            if (userIsExist && userIsExist.isVerified === true) {
                throw new customError_1.CustomError("User Already Exists", 409);
            }
            else {
                if (!userIsExist) {
                    yield this.userRepository.save(user);
                }
                const otp = this.otpRepository.generateOTP();
                console.log(otp);
                const otpId = yield this.otpRepository.sendOTP(user.email, otp);
                const token = yield (0, tokenizeDataHelper_1.generateToken)(otpId);
                console.log("Otp data Saved in datbase");
                return token;
            }
        });
    }
    profile(id) {
        const user = this.userRepository.getUser(id);
        if (!user) {
            throw new customError_1.CustomError("User doesnot Exist", 401);
        }
        return user;
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email) {
                    throw new customError_1.CustomError("Email is Not Found", 404);
                }
                return this.userRepository.setResetToken(email);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                throw new customError_1.CustomError(error.message || "Error In forgotPassword", 500);
            }
        });
    }
    setResetPassword(token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!token || !password) {
                    throw new customError_1.CustomError("Token or Password  is not provided", 400);
                }
                yield this.userRepository.findResetTokenAndSavePassword(token, password);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                throw new customError_1.CustomError(error.message || "Error In forgotPassword", 500);
            }
        });
    }
    getAllUsers(page, pageSize, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.getAllUsers(page, pageSize, searchQuery);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                throw new customError_1.CustomError(error.message || "Error In Fetching all Users", 500);
            }
        });
    }
    BlockOrUnblockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.toggleBlockUser(id);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                throw new customError_1.CustomError(error.message || "Error In While Changing the status of the User", 500);
            }
        });
    }
    editUserProfile(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.updateUserProfile(userId, data);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                throw new customError_1.CustomError(error.message || "Error In While Changing the status of the User", 500);
            }
        });
    }
    changeProfilePic(userId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userId) {
                    throw new customError_1.CustomError("User Id is not Defined", 404);
                }
                if (image.trim().length === 0) {
                    throw new customError_1.CustomError("Image Is Not Provided", 422);
                }
                return yield this.userRepository.changeUserProfilePic(userId, image);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                throw new customError_1.CustomError(error.message || "Error In While Changing the status of the User", 500);
            }
        });
    }
    changeUserPassword(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userId) {
                    throw new customError_1.CustomError("Invalid UserId ", 403);
                }
                yield this.userRepository.sendUserChangePasswordLink(userId);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                throw new customError_1.CustomError(error.message || "Error In While Changing the status of the User", 500);
            }
        });
    }
    addMedicalRecord(userId, fileUrl, title, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const medicalRecord = yield this.userRepository.addMedicalRecord(userId, fileUrl, title, description);
                return medicalRecord;
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                throw new customError_1.CustomError(error.message || "Error In While Changing the status of the User", 500);
            }
        });
    }
    getUserMedicalRecords(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const medicalRecords = yield this.userRepository.getMedicalRecords(userId);
                return medicalRecords;
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                throw new customError_1.CustomError(error.message || "Error In While Changing the status of the User", 500);
            }
        });
    }
}
exports.UserUseCase = UserUseCase;
