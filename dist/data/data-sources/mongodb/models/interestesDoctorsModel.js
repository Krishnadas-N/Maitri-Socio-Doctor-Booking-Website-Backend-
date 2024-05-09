"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interestedDoctorModel = void 0;
const mongoose_1 = require("mongoose");
const interestedDoctorSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorIds: [{
            doctorId: {
                type: mongoose_1.Types.ObjectId,
                ref: 'Doctor',
                required: true
            },
            dateAdded: {
                type: Date,
                default: Date.now
            }
        }],
}, {
    timestamps: true
});
const interestedDoctorModel = (0, mongoose_1.model)('InterestedDoctor', interestedDoctorSchema);
exports.interestedDoctorModel = interestedDoctorModel;
