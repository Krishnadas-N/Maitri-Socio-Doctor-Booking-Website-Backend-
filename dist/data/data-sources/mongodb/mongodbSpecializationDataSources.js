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
exports.MongoDbDoctorSpecializtionDataSource = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const customError_1 = require("../../../utils/customError");
const doctorSpecializationModel_1 = require("./models/doctorSpecializationModel");
const doctorModel_1 = require("./models/doctorModel");
class MongoDbDoctorSpecializtionDataSource {
    constructor() { }
    create(specData) {
        return __awaiter(this, void 0, void 0, function* () {
            const specialization = new doctorSpecializationModel_1.doctorCategoryModel(Object.assign({}, specData));
            return yield specialization.save();
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const specializations = yield doctorSpecializationModel_1.doctorCategoryModel.find().exec();
            return specializations || null;
        });
    }
    updateSpec(id, specData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new customError_1.CustomError('Invalid ID parameter', 403);
            }
            const result = yield doctorSpecializationModel_1.doctorCategoryModel.findOneAndUpdate({ _id: id }, specData, { upsert: true, new: true });
            console.log(result);
            if (!result) {
                throw new customError_1.CustomError("The Specialization is Not Found", 404);
            }
            return result;
        });
    }
    blockSpec(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                    throw new customError_1.CustomError('Invalid ID parameter', 403);
                }
                const doctorCategory = yield doctorSpecializationModel_1.doctorCategoryModel.findById(id);
                if (!doctorCategory) {
                    throw new customError_1.CustomError("DoctorCategory not found", 404);
                }
                doctorCategory.isBlocked = !doctorCategory.isBlocked;
                yield doctorCategory.save();
                if (doctorCategory.isBlocked) {
                    yield doctorModel_1.doctorModel.updateMany({ specialization: doctorCategory._id }, { isBlocked: true });
                }
                return doctorCategory;
            }
            catch (err) {
                throw new customError_1.CustomError(err.message || "Error while Block the Specilalization in the databse", 404);
            }
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new customError_1.CustomError('Invalid ID parameter', 403);
            }
            const specialization = yield doctorSpecializationModel_1.doctorCategoryModel.findById(id).exec();
            return specialization || null;
        });
    }
    getByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const regexPattern = new RegExp(name, 'i');
            try {
                return yield doctorSpecializationModel_1.doctorCategoryModel.findOne({ name: regexPattern }).exec();
            }
            catch (error) {
                // Handle errors
                console.error("Error while searching specialization by name:", error);
                throw new customError_1.CustomError(error.message || 'Error while searching specialization by name', 500);
            }
        });
    }
}
exports.MongoDbDoctorSpecializtionDataSource = MongoDbDoctorSpecializtionDataSource;
