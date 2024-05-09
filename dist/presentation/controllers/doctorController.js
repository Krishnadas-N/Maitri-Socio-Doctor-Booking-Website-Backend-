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
exports.saveSelectedSlots = exports.updateDoctorProfilePic = exports.getCurrentDoctor = exports.getDoctorById = exports.chnageStatus = exports.getDoctors = exports.VerifyProfile = exports.resetPassword = exports.forgotPassword = exports.login = exports.registerAdditionalInfo = exports.registerProfessionalInfo = exports.registerBasicInfo = void 0;
const reponseHandler_1 = require("../../utils/reponseHandler");
const customError_1 = require("../../utils/customError");
const requestValidationMiddleware_1 = require("../../middlewares/requestValidationMiddleware");
// import cloudinary from "../../../config/cloudinary";
function registerBasicInfo(doctorService) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { firstName, lastName, gender, dateOfBirth, password, email, phone } = req.body;
                const token = yield doctorService.registerBasicInfoUseCase({
                    firstName,
                    lastName,
                    gender,
                    dateOfBirth,
                    email,
                    phone,
                    password
                });
                return (0, reponseHandler_1.sendSuccessResponse)(res, { token }, "Basic information registered successfully and otp send to Doctor ema");
            }
            catch (err) {
                console.error("Error occurred while registering basic info:", err);
                next(err);
            }
        });
    };
}
exports.registerBasicInfo = registerBasicInfo;
function registerProfessionalInfo(doctorService) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctorId = req.user.id || '';
                if (!doctorId) {
                    throw new customError_1.CustomError('Doctor is not authenticated', 401);
                }
                console.log(req.files);
                console.log(req.body);
                if (!req.files || req.files.length === 0) {
                    throw new customError_1.CustomError('No files uploaded', 400);
                }
                const cloudinaryUrls = req.body.cloudinaryUrls;
                if (cloudinaryUrls.length === 0) {
                    console.error('No Cloudinary URLs found.');
                    return res.status(500).send('Internal Server Error');
                }
                const certificationUrls = cloudinaryUrls;
                const { specialization, education, experience, languages, consultationFee, address } = req.body;
                const doctorData = yield doctorService.registerProfessionalInfoUseCase({
                    address,
                    specialization,
                    education,
                    experience,
                    certifications: certificationUrls,
                    languages,
                    consultationFee
                }, doctorId);
                return (0, reponseHandler_1.sendSuccessResponse)(res, doctorData, "Professional information registered successfully");
            }
            catch (err) {
                console.error("Error occurred while registering professional info:", err);
                next(err);
            }
        });
    };
}
exports.registerProfessionalInfo = registerProfessionalInfo;
function registerAdditionalInfo(doctorService) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctorId = req.user.id;
                console.log("additional Info ", req.body, req.body.consultationFee);
                const doctorData = yield doctorService.RegisterAdditionalInfoUseCase(req.body, doctorId);
                return (0, reponseHandler_1.sendSuccessResponse)(res, doctorData, "Additional information registered successfully");
            }
            catch (err) {
                console.error("Error occurred while registering additional info:", err);
                next(err);
            }
        });
    };
}
exports.registerAdditionalInfo = registerAdditionalInfo;
function login(doctorService) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const doctorLoggedInData = yield doctorService.login(email, password);
                if (!doctorLoggedInData) {
                    throw new customError_1.CustomError("Invalid credentials", 401);
                }
                return (0, reponseHandler_1.sendSuccessResponse)(res, doctorLoggedInData, "Login successful");
            }
            catch (err) {
                console.error("Error occurred during login:", err);
                next(err);
            }
        });
    };
}
exports.login = login;
function forgotPassword(doctorService) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                yield doctorService.forgotPassword(email);
                return (0, reponseHandler_1.sendSuccessResponse)(res, {}, 'Message sent Successfully');
            }
            catch (error) {
                next(error);
            }
        });
    };
}
exports.forgotPassword = forgotPassword;
function resetPassword(doctorService) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const passwordToken = req.params.token;
                const { newPassword } = req.body;
                yield doctorService.setResetPassword(passwordToken, newPassword);
                return (0, reponseHandler_1.sendSuccessResponse)(res, "Password Reset Successfully", "Password has been changed");
            }
            catch (error) {
                next(error);
            }
        });
    };
}
exports.resetPassword = resetPassword;
function VerifyProfile(doctorService) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctorId = req.params.doctorId;
                if (!doctorId) {
                    throw new customError_1.CustomError('No Id provided in the Token', 400);
                }
                const doctor = yield doctorService.AcceptDoctorProfile(doctorId);
                return (0, reponseHandler_1.sendSuccessResponse)(res, doctor, "Password has been changed");
            }
            catch (error) {
                next(error);
            }
        });
    };
}
exports.VerifyProfile = VerifyProfile;
function getDoctors(doctorService) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Log fro Dcotor Cotnrillers ********************************************");
                const page = parseInt(req.query.page, 10) || 1;
                const limit = parseInt(req.query.limit, 10) || 25;
                const search = req.query.search || '';
                console.log(page, search, limit);
                const doctors = yield doctorService.GetDoctors(page, search, limit);
                console.log("Log fro Dcotor Cotnrillers ********************************************", doctors);
                return (0, reponseHandler_1.sendSuccessResponse)(res, { doctors }, "Doctors Fetched Success Fully");
            }
            catch (error) {
                next(error);
            }
        });
    };
}
exports.getDoctors = getDoctors;
function chnageStatus(doctorService) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctorId = req.params.doctorId;
                if (!doctorId) {
                    throw new customError_1.CustomError('Doctor Id is not Defined', 403);
                }
                const doctor = yield doctorService.changeDoctorStatus(doctorId);
                return (0, reponseHandler_1.sendSuccessResponse)(res, { doctor }, "Doctor Fetched Success Fully");
            }
            catch (error) {
                next(error);
            }
        });
    };
}
exports.chnageStatus = chnageStatus;
function getDoctorById(doctorService) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("GEttt Docotroe By ID   ", req.params.doctorId);
            try {
                const doctorId = req.params.doctorId;
                if (!doctorId) {
                    throw new customError_1.CustomError('Doctor Id is not Defined', 403);
                }
                const doctor = yield doctorService.getDoctorById(doctorId);
                return (0, reponseHandler_1.sendSuccessResponse)(res, { doctor }, "Doctor Fetched Success Fully");
            }
            catch (error) {
                next(error);
            }
        });
    };
}
exports.getDoctorById = getDoctorById;
function getCurrentDoctor(doctorService) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getCurrentDoctor   ");
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const doctorId = req.user.id;
                console.log("getCurrentDoctor   ", doctorId);
                if (!doctorId) {
                    throw new customError_1.CustomError('Doctor Id is not Defined', 403);
                }
                const doctor = yield doctorService.getDoctorById(doctorId);
                return (0, reponseHandler_1.sendSuccessResponse)(res, doctor, "Doctor Fetched Success Fully");
            }
            catch (error) {
                next(error);
            }
        });
    };
}
exports.getCurrentDoctor = getCurrentDoctor;
function updateDoctorProfilePic(doctorService) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getCurrentDoctor   ");
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const doctorId = req.user.id;
                const imageUrl = req.body.cloudinaryUrls[0];
                console.log("image Url from COntrolelr", imageUrl);
                if (!doctorId) {
                    throw new customError_1.CustomError('Doctor Id is not Defined', 403);
                }
                const doctor = yield doctorService.getDoctorById(doctorId);
                return (0, reponseHandler_1.sendSuccessResponse)(res, doctor, "Doctor Fetched Success Fully");
            }
            catch (error) {
                next(error);
            }
        });
    };
}
exports.updateDoctorProfilePic = updateDoctorProfilePic;
function saveSelectedSlots(doctorService) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getCurrentDoctor   ", req.body);
            try {
                (0, requestValidationMiddleware_1.assertHasUser)(req);
                const doctorId = req.user.id;
                console.log(doctorId, req.body.selectedSlots);
                if (!doctorId) {
                    throw new customError_1.CustomError('Doctor Id is not defined', 403);
                }
                const doctor = yield doctorService.saveSelectedSlots(doctorId, req.body.selectedSlots);
                return (0, reponseHandler_1.sendSuccessResponse)(res, doctor, "Doctor slots saved successfully");
            }
            catch (error) {
                next(error);
            }
        });
    };
}
exports.saveSelectedSlots = saveSelectedSlots;
