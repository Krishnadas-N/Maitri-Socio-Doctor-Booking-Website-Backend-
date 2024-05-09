"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.MongoDbDoctorDataSourceImpl = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const customError_1 = require("../../../utils/customError");
const Doctor_1 = __importStar(require("../../../domain/entities/Doctor"));
const doctorModel_1 = require("./models/doctorModel");
const roleModel_1 = require("./models/roleModel");
class MongoDbDoctorDataSourceImpl {
    constructor() { }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const DoctorDetails = yield doctorModel_1.doctorModel.findOne({ email });
            return DoctorDetails ? this.convertToDomain(DoctorDetails) : null;
        });
    }
    DbsaveBasicInfo(doctor) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newDoctor = new doctorModel_1.doctorModel(doctor);
                const savedDoctor = yield newDoctor.save();
                console.log(savedDoctor);
                const doctorId = savedDoctor._id; // Adjust this according to your schema
                if (!doctorId) {
                    throw new Error('doctor ID not generated after saving');
                }
                return doctorId;
            }
            catch (err) {
                throw new customError_1.CustomError(err.message || 'Error on saving Doctor basic info to database', 500);
            }
        });
    }
    DbsaveProfessionalInfo(doctor, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(doctorId, "email from  db save professional");
            const { address, specialization, education, experience, languages, certifications } = doctor;
            const existingDoctor = yield doctorModel_1.doctorModel.findOne({ _id: doctorId });
            if (!existingDoctor) {
                throw new customError_1.CustomError("No Such Doctor Found", 404);
            }
            if (!existingDoctor.isVerified) {
                throw new customError_1.CustomError("Doctor account has not been verified yet. Please complete the verification process.", 403);
            }
            if (address) {
                existingDoctor.address = Object.assign(Object.assign({}, existingDoctor.address), address);
            }
            if (specialization) {
                existingDoctor.specialization = specialization;
            }
            if (education) {
                existingDoctor.education = education;
            }
            if (experience) {
                existingDoctor.experience = experience;
            }
            if (languages) {
                existingDoctor.languages = languages;
            }
            if (certifications) {
                existingDoctor.certifications = certifications;
            }
            existingDoctor.registrationStepsCompleted = existingDoctor.registrationStepsCompleted + 1;
            yield existingDoctor.save();
            return existingDoctor;
        });
    }
    DbsaveAdditionalInfo(doctor, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(doctor);
            // const { consultationFee, profilePic, availability, typesOfConsultation, maxPatientsPerDay } = doctor;
            const existingDoctor = yield doctorModel_1.doctorModel.findOne({ _id: doctorId });
            if (!existingDoctor) {
                throw new customError_1.CustomError("No Such Doctor Found", 404);
            }
            if (!existingDoctor.isVerified) {
                throw new customError_1.CustomError("Doctor account has not been verified yet. Please complete the verification process.", 403);
            }
            console.log(doctor.consultationFee, "Consultation Fee");
            console.log(doctor.availability);
            const { consultationFee, typesOfConsultation, availability, maxPatientsPerDay } = doctor;
            if (consultationFee) {
                existingDoctor.consultationFee = consultationFee;
            }
            if (typesOfConsultation) {
                const consultationTypes = typesOfConsultation.map((item) => item.type);
                existingDoctor.typesOfConsultation = consultationTypes;
            }
            if (availability) {
                existingDoctor.availability = availability;
            }
            if (maxPatientsPerDay) {
                existingDoctor.maxPatientsPerDay = maxPatientsPerDay;
            }
            existingDoctor.registrationStepsCompleted = existingDoctor.registrationStepsCompleted + 1;
            return yield existingDoctor.save();
        });
    }
    verifyDoctor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield doctorModel_1.doctorModel.updateOne({ email }, {
                    $set: { isVerified: true },
                    $inc: { registrationStepsCompleted: 1 }
                });
            }
            catch (error) {
                throw new Error(`Error deleting doctor: ${error}`);
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return doctorModel_1.doctorModel.findById(id).populate({
                path: 'specialization',
                select: 'name', // Select the name field from DoctorCategory
                model: 'DoctorCategory',
                options: {
                    as: 'psycharitst'
                }
            }).exec();
        });
    }
    findResetTokenAndSavePassword(token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctor = yield doctorModel_1.doctorModel.findOne({ resetToken: token }).exec();
                if (!doctor) {
                    throw new customError_1.CustomError('doctor not found or unauthorized', 404);
                }
                doctor.password = password;
                doctor.resetToken = null;
                yield doctor.save();
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
    saveResetToken(token, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctor = yield doctorModel_1.doctorModel.findOne({ email });
                if (!doctor) {
                    throw new customError_1.CustomError('doctor not found or unauthorized', 404);
                }
                if (!doctor.isVerified) {
                    throw new customError_1.CustomError('doctor Crenditals is Not Verified', 403);
                }
                doctor.resetToken = token;
                yield doctor.save();
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
    AcceptprofileComplete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                    throw new customError_1.CustomError('Invalid doctor ID', 400);
                }
                const doctor = yield doctorModel_1.doctorModel.findByIdAndUpdate(id, { isProfileComplete: true }, { new: true }).populate({
                    path: 'specialization',
                    select: 'name', // Select the name field from DoctorCategory
                    model: 'DoctorCategory',
                    options: {
                        as: 'psycharitst'
                    }
                }).exec();
                return doctor === null || doctor === void 0 ? void 0 : doctor.toObject();
            }
            catch (error) {
                throw new Error(`Error updating profile completion for doctor ${id}: ${error}`);
            }
        });
    }
    findDoctors(page, searchQuery, itemsPerPage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNum = page || 1;
                const perPage = itemsPerPage || 10; // Number of items per page
                const skip = (pageNum - 1) * perPage;
                let query = {};
                if (searchQuery) {
                    query = {
                        $or: [
                            { firstName: { $regex: searchQuery, $options: 'i' } },
                            { lastName: { $regex: searchQuery, $options: 'i' } },
                        ],
                    };
                }
                const doctors = yield doctorModel_1.doctorModel.find(query)
                    .populate({
                    path: 'specialization',
                    select: 'name', // Select the name field from DoctorCategory
                    model: 'DoctorCategory',
                    options: {
                        as: 'psycharitst'
                    }
                })
                    .skip(skip)
                    .limit(perPage)
                    .exec();
                return doctors;
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
    changeStatusofDoctor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                    throw new customError_1.CustomError("Invalid id format", 400);
                }
                const doctor = yield doctorModel_1.doctorModel.findById(id).populate({
                    path: 'specialization',
                    select: 'name', // Select the name field from DoctorCategory
                    model: 'DoctorCategory',
                    options: {
                        as: 'psycharitst'
                    }
                }).exec();
                if (!doctor) {
                    throw new customError_1.CustomError("Doctor not found", 404);
                }
                doctor.isBlocked = !doctor.isBlocked;
                yield doctor.save();
                return doctor;
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
            yield doctorModel_1.doctorModel.updateOne({ _id: doctorId }, { $set: { profilePic: image } });
        });
    }
    saveSelectedSlots(doctorId, selectedSlots) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctor = yield doctorModel_1.doctorModel.findOneAndUpdate({ _id: doctorId }, { selectedSlots: selectedSlots }, { new: true });
                if (!doctor) {
                    throw new customError_1.CustomError('Doctor not found', 403);
                }
                return doctor;
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    throw new customError_1.CustomError(error.message || 'Failed to save selected slots', 500);
                }
            }
        });
    }
    fetchRoleDetails(roleIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roles = yield roleModel_1.roleModel.find({ _id: { $in: roleIds } });
                const roleDetails = roles.map(role => ({
                    roleId: role._id.toString(),
                    roleName: role.name,
                    permissions: role.permissions // Assuming your roleModel has a 'permissions' field
                }));
                return roleDetails;
            }
            catch (error) {
                if (error instanceof customError_1.CustomError) {
                    throw error;
                }
                else {
                    throw new customError_1.CustomError(error.message || 'Failed to findByemail', 500);
                }
            }
        });
    }
    convertToDomain(doctorData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!doctorData)
                return null;
            const roleIds = ((_a = doctorData === null || doctorData === void 0 ? void 0 : doctorData.roles) === null || _a === void 0 ? void 0 : _a.map(role => role.toString())) || [];
            const roleDetails = yield this.fetchRoleDetails(roleIds);
            const address = doctorData.address ? new Doctor_1.Address(doctorData.address.state, doctorData.address.city, doctorData.address.zipcode, doctorData.address.country) : doctorData.address;
            const education = doctorData.education ? doctorData.education.map(edu => new Doctor_1.Education(edu.degree, edu.institution, edu.year)) : [];
            const availability = doctorData.availability ? doctorData.availability.map(avail => new Doctor_1.Availability(avail.dayOfWeek, avail.startTime, avail.endTime, avail.isAvailable)) : [];
            const reviews = doctorData.reviews ? doctorData.reviews.map(review => new Doctor_1.Review(review.patientName, review.comment, review.rating, review.createdAt)) : [];
            const doctor = new Doctor_1.default(doctorData._id, doctorData.firstName, doctorData.lastName, doctorData.gender, doctorData.dateOfBirth, doctorData.email, doctorData.password, doctorData.phone, address, doctorData.specialization, education, doctorData.experience, doctorData.certifications, doctorData.languages, availability, doctorData.profilePic, doctorData.bio, doctorData.isVerified, doctorData.typesOfConsultation, doctorData.maxPatientsPerDay, roleDetails, doctorData.consultationFee, doctorData.registrationStepsCompleted, doctorData.createdAt, doctorData.updatedAt, doctorData.followers, doctorData.rating, doctorData.isBlocked, reviews, doctorData.isProfileComplete, doctorData.resetToken, doctorData.selectedSlots);
            return doctor.toJson(); // Assuming toJSON() method is defined in Doctor class
        });
    }
}
exports.MongoDbDoctorDataSourceImpl = MongoDbDoctorDataSourceImpl;
