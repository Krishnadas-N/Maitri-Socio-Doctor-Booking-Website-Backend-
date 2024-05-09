"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorCategoryModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const DoctorCategorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    isBlocked: {
        type: Boolean,
        default: false
    }
});
const doctorCategoryModel = mongoose_1.default.model('DoctorCategory', DoctorCategorySchema);
exports.doctorCategoryModel = doctorCategoryModel;
