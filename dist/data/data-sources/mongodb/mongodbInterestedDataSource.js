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
exports.InterestedDoctorsDataSource = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const interestesDoctorsModel_1 = require("./models/interestesDoctorsModel");
const customError_1 = require("../../../utils/customError");
class InterestedDoctorsDataSource {
    constructor() { }
    addToInterest(userId, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.default.Types.ObjectId.isValid(userId) || !mongoose_1.default.Types.ObjectId.isValid(doctorId)) {
                    throw new customError_1.CustomError('Invalid  User or Doctor ID', 400);
                }
                let interestedDoctor = yield interestesDoctorsModel_1.interestedDoctorModel.findOne({ userId: userId });
                if (!interestedDoctor) {
                    interestedDoctor = new interestesDoctorsModel_1.interestedDoctorModel({ userId: userId, doctorIds: [] });
                }
                interestedDoctor.doctorIds.push({ doctorId: doctorId, dateAdded: new Date() });
                yield interestedDoctor.save();
                return interestedDoctor.toObject();
            }
            catch (error) {
                throw new customError_1.CustomError(error.message || "Failed to add doctor to interests", 500);
            }
        });
    }
    getInterests(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                    throw new customError_1.CustomError('Invalid  User ID', 400);
                }
                const [interests] = yield interestesDoctorsModel_1.interestedDoctorModel.aggregate([
                    {
                        $match: {
                            userId: new mongoose_1.default.Types.ObjectId(userId),
                        }
                    }, {
                        $lookup: {
                            from: 'doctors',
                            localField: "doctorIds.doctorId",
                            foreignField: "_id",
                            as: "doctorsInfo"
                        }
                    },
                ]);
                console.log(interests, "Log from Interests database");
                return interests;
            }
            catch (error) {
                throw new customError_1.CustomError(error.message || "Failed to get interests", 500);
            }
        });
    }
    removeInterest(userId, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.default.Types.ObjectId.isValid(userId) || !mongoose_1.default.Types.ObjectId.isValid(doctorId)) {
                    throw new customError_1.CustomError('Invalid  User or Doctor ID', 400);
                }
                const interest = yield interestesDoctorsModel_1.interestedDoctorModel.findOneAndUpdate({ userId: userId }, { $pull: { doctorIds: { doctorId: doctorId } } }, { new: true }).exec();
                if (!interest) {
                    throw new customError_1.CustomError("Interest not found", 404);
                }
            }
            catch (error) {
                throw new customError_1.CustomError(error.message || "Failed to remove interest", 500);
            }
        });
    }
}
exports.InterestedDoctorsDataSource = InterestedDoctorsDataSource;
