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
exports.DoctorUseCaseImpl = void 0;
const customError_1 = require("../../utils/customError");
const tokenizeDataHelper_1 = require("../../utils/tokenizeDataHelper");
const passwordUtils_1 = require("../../utils/passwordUtils");
const passportUtils_1 = require("../../utils/passportUtils");
class DoctorUseCaseImpl {
    constructor(doctorRepository, otpRepository) {
        this.doctorRepository = doctorRepository;
        this.otpRepository = otpRepository;
    }
    registerBasicInfoUseCase(doctorData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'gender', 'dateOfBirth', 'password'];
                for (const field of requiredFields) {
                    if (!doctorData[field]) {
                        throw new customError_1.CustomError(`Missing ${field}`, 406);
                    }
                }
                if (doctorData.email) {
                    const isDoctorExists = yield this.doctorRepository.findDoctorByEmail(doctorData.email);
                    if (isDoctorExists && isDoctorExists.isVerified === true) {
                        throw new customError_1.CustomError("This Email is already Exists, Please Login", 409);
                    }
                    else {
                        if (!isDoctorExists) {
                            yield this.doctorRepository.saveBasicInfo(doctorData);
                        }
                        const otp = this.otpRepository.generateOTP();
                        console.log(otp);
                        const otpId = yield this.otpRepository.sendOTP(doctorData.email, otp);
                        console.log("OTP sent successfully");
                        console.log("Otp data Saved in datbase");
                        const token = yield (0, tokenizeDataHelper_1.generateToken)(otpId);
                        return token;
                    }
                }
                else {
                    throw new customError_1.CustomError("Missing Email Field ", 406);
                }
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    console.error("An unexpected error occurred:", error);
                    throw new customError_1.CustomError(error.message || "An unexpected error occurred.", 500);
                }
            }
        });
    }
    registerProfessionalInfoUseCase(doctorData, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(doctorId);
                return yield this.doctorRepository.saveProfessionalInfo(doctorData, doctorId);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    console.error("An unexpected error occurred:", error);
                    throw new customError_1.CustomError(error.message || "An unexpected error occurred.", 500);
                }
            }
        });
    }
    RegisterAdditionalInfoUseCase(doctorData, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.doctorRepository.saveAdditionalInfo(doctorData, doctorId);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    console.error("An unexpected error occurred:", error);
                    throw new customError_1.CustomError(error.message || "An unexpected error occurred.", 500);
                }
            }
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctor = yield this.doctorRepository.findDoctorByEmail(email);
                if (!doctor) {
                    throw new customError_1.CustomError("Invalid Crenditials", 404);
                }
                if (!doctor.isVerified) {
                    throw new customError_1.CustomError("User is Not Verified", 403);
                }
                const isValidPassword = yield passwordUtils_1.PasswordUtil.comparePasswords(password, doctor.password);
                if (!isValidPassword) {
                    throw new customError_1.CustomError('Invalid password', 409);
                }
                if (doctor && doctor._id) {
                    console.log(email, password);
                    const tokenData = (0, passportUtils_1.issueJWT)({ _id: doctor._id.toString(), roles: doctor.roles || [] });
                    console.log(tokenData);
                    return { doctor, token: tokenData.token };
                }
                else {
                    throw new customError_1.CustomError('Id is not found in Doctor', 404);
                }
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    console.error("An unexpected error occurred:", error);
                    throw new customError_1.CustomError(error.message || "An unexpected error occurred.", 500);
                }
            }
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email) {
                    throw new customError_1.CustomError('Email is Not Found', 404);
                }
                return this.doctorRepository.setResetToken(email);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                throw new customError_1.CustomError(error.message || 'Error In forgotPassword', 500);
            }
        });
    }
    setResetPassword(token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!token || password) {
                    throw new customError_1.CustomError('Token or Password  is not provided', 400);
                }
                yield this.doctorRepository.findResetTokenAndSavePassword(token, password);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                throw new customError_1.CustomError(error.message || 'Error In forgotPassword', 500);
            }
        });
    }
    AcceptDoctorProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id) {
                    throw new customError_1.CustomError('Id  is not provided', 400);
                }
                return yield this.doctorRepository.AcceptDoctorProfile(id);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                throw new customError_1.CustomError(error.message || 'Error In Accepting Doctor Profile', 500);
            }
        });
    }
    GetDoctors(page, searchQuery, itemsPerPage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.doctorRepository.GetDoctors(page, searchQuery, itemsPerPage);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                console.error('Unexpected error:', error);
                throw new Error(error.message || 'Internal server error');
            }
        });
    }
    changeDoctorStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id) {
                    throw new customError_1.CustomError('Doctor Id is Not defined', 400);
                }
                return yield this.doctorRepository.changeStatusofDoctor(id);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                console.error('Unexpected error:', error);
                throw new Error(error.message || 'Internal server error');
            }
        });
    }
    getDoctorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id) {
                    throw new customError_1.CustomError('Doctor Id is Not defined', 400);
                }
                return yield this.doctorRepository.findDoctorById(id);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                console.error('Unexpected error:', error);
                throw new Error(error.message || 'Internal server error');
            }
        });
    }
    changeProfilePic(doctorId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!doctorId) {
                    throw new customError_1.CustomError("User Id is not Defined", 404);
                }
                if (image.trim().length === 0) {
                    throw new customError_1.CustomError("Image Is Not Provided", 422);
                }
                return yield this.doctorRepository.changeProfilePic(doctorId, image);
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                throw new customError_1.CustomError(error.message || "Error In While Changing the status of the User", 500);
            }
        });
    }
    saveSelectedSlots(doctorId, selectedSlots) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!doctorId) {
                    throw new customError_1.CustomError("User Id is not Defined", 404);
                }
                if (!selectedSlots) {
                    throw new customError_1.CustomError("Slots is  is not provided", 404);
                }
                return yield this.doctorRepository.saveSelectedSlots(doctorId, selectedSlots);
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
exports.DoctorUseCaseImpl = DoctorUseCaseImpl;
